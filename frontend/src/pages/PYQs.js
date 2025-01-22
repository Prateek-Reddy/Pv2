import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const PYQs = () => {
    const [pyqs, setPYQs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [companies, setCompanies] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedCourseCode, setSelectedCourseCode] = useState('');

    // Fetch companies for the dropdown
    const fetchCompanies = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/companies");
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    // Fetch subjects for the dropdown
    const fetchSubjects = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/subjects");
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    // Fetch PYQs with pagination and filtering
    const fetchPYQs = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/pyqs", {
                params: { 
                    page, 
                    limit: 10, 
                    company_name: selectedCompany, 
                    course_code: selectedCourseCode 
                },
            });

            console.log(response.data); // Debugging the response data

            setPYQs(response.data.pyqs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching PYQs:", error);
        }
    }, [page, selectedCompany, selectedCourseCode]);

    // Change page
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    useEffect(() => {
        fetchCompanies();
        fetchSubjects();
        fetchPYQs();
    }, [fetchPYQs, page]);

    return (
        <div className="container mt-5">
            <h2 className="text-primary fw-bold mb-4">Previous Year Questions</h2>

            {/* Filter Dropdowns */}
            <div className="mb-3">
                <label htmlFor="companySelect" className="form-label">Select Company</label>
                <select
                    id="companySelect"
                    className="form-select"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                >
                    <option value="">All Companies</option>
                    {companies.map((company) => (
                        <option key={company.company_name} value={company.company_name}>
                            {company.company_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="subjectSelect" className="form-label">Select Course</label>
                <select
                    id="subjectSelect"
                    className="form-select"
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                >
                    <option value="">All Courses</option>
                    {subjects.map((subject) => (
                        <option key={subject.course_code} value={subject.course_code}>
                            {subject.subject_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Question</th>
                            <th>Course Name</th>
                            <th>Course Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pyqs.length > 0 ? (
                            pyqs.map((pyq) => (
                                <tr key={pyq.pyq_id}>
                                    <td>{pyq.company_name}</td>
                                    <td>{pyq.pyq_question}</td>
                                    <td>{pyq.course_name}</td>
                                    <td>{pyq.course_code}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            <footer className="mt-5 text-center text-muted">
                <p>AI Placement Assistant - 2025 | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default PYQs;