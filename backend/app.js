// app.js
const cors = require('cors');
const express = require('express');
const db = require('./db'); // Import the database connection
const multer = require("multer");
const fs = require("fs/promises");
const bodyParser = require("body-parser");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const router=express.Router();
const roundsRoutes = require("./routes/rounds");
const gradioRoutes = require("./routes/gradio");
// Import MongoDB Models
const RoundsandGenderWise = require("./models/RoundsandGenderWise");
const TypeofRounds = require("./models/TypeofRounds");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


////chatbot



app.get('/api/companies', async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM public.companies');
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch companies' });
  }
});


/////////////////CURR ANALYSIS/////////////////
// Route to fetch curriculum analysis data, course names, or specific curriculum data
// Route to fetch distinct course codes from curriculum_analysis
app.get('/api/course-codes', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT course_id FROM curriculum_analysis');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching distinct course codes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch course names based on distinct course codes
app.get('/api/course-names', async (req, res) => {
  try {
    const courseCodes = await db.query('SELECT DISTINCT course_id FROM curriculum_analysis');
    const codes = courseCodes.rows.map(row => row.course_id);

    // Fetch course names from subjects table using the distinct course codes
    const courseNames = await db.query('SELECT course_code, subject_name FROM subjects WHERE course_code = ANY($1)', [codes]);
    res.status(200).json(courseNames.rows);
  } catch (error) {
    console.error('Error fetching course names:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to fetch curriculum analysis data for a specific course code
app.get('/api/curriculum-analysis/:courseCode', async (req, res) => {
  const { courseCode } = req.params;

  try {
    // Fetch data from curriculum_analysis table based on course_code
    const data = await db.query('SELECT * FROM curriculum_analysis WHERE course_id = $1', [courseCode]);
    res.status(200).json(data.rows);
  } catch (error) {
    console.error('Error fetching curriculum analysis data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/////////////////CURR ANALYSIS/////////////////


////////////////////PYQS ///////////////

// Route to fetch PYQs with pagination
app.get('/api/pyqs', async (req, res) => {
  const { page = 1, limit = 10, company_name, course_code } = req.query;
  const offset = (page - 1) * limit;

  try {
      // Build the base query
      let query = 'SELECT * FROM public.pyqs';
      const params = [];
      const conditions = [];

      // Add filtering conditions
      if (company_name) {
          conditions.push('company_name = $' + (params.length + 1));
          params.push(company_name);
      }
      if (course_code) {
          conditions.push('course_code = $' + (params.length + 1));
          params.push(course_code);
      }

      // Append conditions to the query if any
      if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
      }

      // Fetch the total number of records
      const countResult = await db.query('SELECT COUNT(*) FROM (' + query + ') AS count_query', params);
      const totalRecords = countResult.rows[0].count;
      const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

      // Fetch the actual records for the current page
      query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      const result = await db.query(query, params);

      res.status(200).json({
          pyqs: result.rows,
          totalPages,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch PYQs' });
  }
});
  
  ////////////////////PYQS ///////////////

// Route to fetch all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM public.subjects');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});


//////////////////////////////////////UPLOAD EXCEL VIS STATS////////////////////////////////////////////
// Multer setup for file uploads
const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        return cb(new Error("Only Excel files are allowed!"), false);
      }
      cb(null, true);
    },
  });
  
  // Upload Route
// Upload Route
app.post("/api/uploads", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Read Excel File
        const workbook = xlsx.readFile(req.file.path);
        const sheetNames = workbook.SheetNames;

        // Determine the collection based on the file name
        const fileName = req.file.originalname.toLowerCase();

        for (let sheetName of sheetNames) {
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            console.log(`Parsed data from ${sheetName}:`, data); // Debugging

            if (fileName.includes("typeofrounds")) {
                // Normalize the data for TypeofRounds
                const normalizedData = data.map(record => ({
                    company: record.COMPANY, // Map the COMPANY field
                    aptitude_round: record['APTITUDE ROUND'] ? Number(record['APTITUDE ROUND']) : 0,
                    technical_round: record['TECHNICAL ROUND'] ? Number(record['TECHNICAL ROUND']) : 0,
                    managerial_round: record['MANAGERIAL ROUND'] ? Number(record['MANAGERIAL ROUND']) : 0,
                    technical_hr: record['TECHNICAL+HR'] ? Number(record['TECHNICAL+HR']) : 0,
                    group_discussion: record['GROUP DISCUSSION'] ? Number(record['GROUP DISCUSSION']) : 0,
                    online_coding: record['ONLINE CODING'] ? Number(record['ONLINE CODING']) : 0,
                    written_coding_round: record['WRITTEN CODING ROUND'] ? Number(record['WRITTEN CODING ROUND']) : 0,
                }));
            
                // Insert normalized data into TypeofRounds collection
                await TypeofRounds.insertMany(normalizedData);
                console.log(`Inserted ${normalizedData.length} records into TypeofRounds`);
            } else if (fileName.includes("placedgender")) {
                // Normalize the data for RoundsandGenderWise
                const normalizedData = data.map(record => ({
                    company: record.COMPANY, // Assuming COMPANY is the correct field
                    no_of_rounds: record['NO: OF ROUNDS'] ? Number(record['NO: OF ROUNDS']) : 0,
                    no_of_online_rounds: record['NO: OF ONLINE ROUNDS'] ? Number(record['NO: OF ONLINE ROUNDS']) : 0,
                    no_of_offline_rounds: record['NO: OF OFFLINE ROUNDS'] ? Number(record['NO: OF OFFLINE ROUNDS']) : 0,
                    no_of_students_hired: record['NO OF STUDENTS HIRED'] ? Number(record['NO OF STUDENTS HIRED']) : null,
                    no_of_male_students: record['NO OF MALE STUDENTS'] ? Number(record['NO OF MALE STUDENTS']) : null,
                    no_of_female_students: record['NO OF FEMALE STUDENTS'] ? Number(record['NO OF FEMALE STUDENTS']) : null,
                }));

                // Insert normalized data into RoundsandGenderWise collection
                await RoundsandGenderWise.insertMany(normalizedData);
                console.log(`Inserted ${normalizedData.length} records into RoundsandGenderWise`);
            } else {
                console.warn(`File "${req.file.originalname}" does not match expected types.`);
            }
        }

        // Clean up the uploaded file
        await fs.unlink(req.file.path);

        res.status(200).json({ message: "Data uploaded successfully!" });
    } catch (error) {
        console.error("Error during upload:", error.message);
        res.status(500).json({ message: "Failed to upload data.", error: error.message });
    }
});
  
  // Example: Fetch all PlacedGender records
  app.get("/api/placed-gender", async (req, res) => {
    try {
      const data = await RoundsandGenderWise.find({});
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data." });
    }
  });
  
  // Example: Fetch all TypeofRounds records
  app.get("/api/type-of-rounds", async (req, res) => {
    try {
      const data = await TypeofRounds.find({});
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data." });
    }
  });
  //////////////////////////////////////UPLOAD EXCEL VIS STATS////////////////////////////////////////////


 ////////////////////////////////////DATA VISUALIZATION APIS////////////////////////////////////

 app.use("/api/rounds", roundsRoutes);

////////////////////////////////////DATA VISUALIZATION APIS////////////////////////////////////
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
