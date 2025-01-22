const express = require("express");
const router = express.Router();
const RoundsandGenderWise = require("../models/RoundsandGenderWise"); // Import your model
const TypeofRounds = require("../models/TypeofRounds"); // Import your model

// ========== EXISTING APIs ==========
router.get("/online-vs-offline", async (req, res) => {
  try {
    const data = await RoundsandGenderWise.find({}, { company: 1, no_of_online_rounds: 1, no_of_offline_rounds: 1 });

    const filteredData = data.filter(
      (item) => item.no_of_online_rounds !== null && item.no_of_offline_rounds !== null
    );

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error fetching online vs offline rounds:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/total-hired-trend", async (req, res) => {
  try {
    const data = await RoundsandGenderWise.find({}, { company: 1, no_of_students_hired: 1 });

    const trendData = data.map((item) => ({
      company: item.company,
      no_of_students_hired: item.no_of_students_hired || 0,
    }));

    res.status(200).json(trendData);
  } catch (error) {
    console.error("Error fetching total students hired trend:", error.message);
    res.status(500).json({ message: "Failed to fetch data.", error: error.message });
  }
});

// ========== NEW APIs ==========
// 1. Online vs. Offline Rounds Across All Companies (Average/Total)
router.get("/online-vs-offline/summary", async (req, res) => {
  try {
    const data = await RoundsandGenderWise.aggregate([
      {
        $group: {
          _id: null,
          total_online_rounds: { $sum: "$no_of_online_rounds" },
          total_offline_rounds: { $sum: "$no_of_offline_rounds" },
        },
      },
    ]);
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching online vs offline summary:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 2. Comparison of Online vs. Offline Rounds for Specific Companies


// 3. Gender Distribution for Companies with Maximum Rounds


// 4. Correlation Between Online Rounds and Total Hires
router.get("/correlation/online-rounds-hires", async (req, res) => {
  try {
    const data = await RoundsandGenderWise.find({}, { no_of_online_rounds: 1, no_of_students_hired: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching correlation data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 5. Top Companies by Total Rounds
router.get("/top-companies/total-rounds", async (req, res) => {
  try {
    const data = await RoundsandGenderWise.find({}, { company: 1, no_of_rounds: 1 })
      .sort({ no_of_rounds: -1 })
      .limit(5);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching top companies:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 6. Round Type Breakdown Across All Companies


// 7. Company-Specific Round Type Distribution


// 8. Trend of Round Types Conducted Across Companies
// Assuming you have already set up your Express app and imported necessary modules
const roundTypes = [
    "aptitude_round",
    "technical_round",
    "managerial_round",
    "technical_hr",
    "group_discussion",
    "online_coding",
    "written_coding_round",
  ];
  
  // Endpoint to get round type data based on selected round type
  router.get("/typerounds/:roundType", async (req, res) => {
    const { roundType } = req.params; // Get the round type from the URL parameter
  
    if (!roundTypes.includes(roundType)) {
      return res.status(400).json({ error: "Invalid round type" });
    }
  
    try {
      const data = await TypeofRounds.aggregate([
        {
          $group: {
            _id: "$company", // Group by company
            count: { $sum: `$${roundType}` }, // Sum the selected round type
          },
        },
      ]);
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching round type data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });


// 9. Gender Success Rate by Round Type
router.get("/gender-success-rate", async (req, res) => {
    try {
      const data = await RoundsandGenderWise.aggregate([
        {
          $group: {
            _id: "$company", // Group by company
            male_passed: { $sum: "$no_of_male_students" }, // Sum the number of male students
            female_passed: { $sum: "$no_of_female_students" }, // Sum the number of female students
          },
        },
      ]);
  
      // Calculate total males and females recruited
      const totalMales = data.reduce((acc, item) => acc + item.male_passed, 0);
      const totalFemales = data.reduce((acc, item) => acc + item.female_passed, 0);
  
      // Add total counts to the response
      res.status(200).json({
        data,
        totalMales,
        totalFemales,
      });
    } catch (error) {
      console.error("Error fetching gender success rate:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });
  

// 10. Average Number of Rounds Conducted Across Companies


  // 11. Company-Wise Breakdown of Students Hired

  

module.exports = router;
