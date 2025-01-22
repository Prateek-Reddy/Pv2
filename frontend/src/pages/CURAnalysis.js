import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurriculumAnalysis = () => {
  // State variables
  const [courseNames, setCourseNames] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course names on component mount
  useEffect(() => {
    async function fetchCourseNames() {
      try {
        const response = await axios.get('http://localhost:5000/api/course-names');
        setCourseNames(response.data);
      } catch (err) {
        setError('Error fetching course names');
        console.error(err);
      }
    }
    fetchCourseNames();
  }, []);

  // Handle course selection change
  const handleCourseChange = async (event) => {
    const courseCode = event.target.value;
    setSelectedCourse(courseCode);
    setLoading(true);
    setCurriculumData([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/curriculum-analysis/${courseCode}`);
      setCurriculumData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching curriculum analysis data');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary fw-bold mb-4">Curriculum Analysis</h2>

      {/* Dropdown for course names */}
      <div className="mb-4">
        <label htmlFor="course-select" className="text-lg mb-2 d-block">Select Course</label>
        <select
          id="course-select"
          className="form-select border p-2 rounded"
          onChange={handleCourseChange}
          value={selectedCourse}
        >
          <option value="">Select a course</option>
          {courseNames.map((course) => (
            <option key={course.course_code} value={course.course_code}>
              {course.subject_name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading Spinner */}
      {loading && <p className="text-info">Loading curriculum data...</p>}

      {/* Error Message */}
      {error && <p className="text-danger">{error}</p>}

      {/* Display Curriculum Data */}
      {curriculumData.length > 0 && (
        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Curriculum</th>
                <th>Syllabus Analysis</th>
                <th>Faculty Attention</th>
              </tr>
            </thead>
            <tbody>
              {curriculumData.map((item) => (
                <tr key={item.cur_id}>
                  <td>{item.curriculum}</td>
                  <td>{item.syllabus_analysis}</td>
                  <td>{item.faculty_attention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-5 text-center text-muted">
        <p>AI Placement Assistant - 2025 | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default CurriculumAnalysis;
