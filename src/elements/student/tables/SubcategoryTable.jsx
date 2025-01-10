import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubcategoryTable = () => {
  const [violations, setViolations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViolationRecords = async () => {
      try {
        // Extract the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem('token'); // Adjust based on where your token is stored

        if (!token) {
          setError('No token found, please log in');
          setLoading(false);
          return;
        }

        // Decode the token (assuming it's a JWT)
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT token to get payload
        const studentId = decodedToken.student_idnumber; // Assuming student_idnumber is part of the token's payload

        if (!studentId) {
          setError('No student ID found in the token');
          setLoading(false);
          return;
        }

        // Fetch violation records grouped by subcategory
        const response = await axios.get(`http://localhost:9000/student-myrecords/subcategory/${studentId}`);
        setViolations(response.data);
      } catch (err) {
        setError('Error fetching violation records');
      } finally {
        setLoading(false);
      }
    };

    fetchViolationRecords();
  }, []);

  // Render loading state
  if (loading) {
    return <p>Loading violation records...</p>;
  }

  // Render error message
  if (error) {
    return <p>{error}</p>;
  }

  // Render the violation records table grouped by subcategory
  return (
    <div>
      <h3>Violation Records</h3>
      {Object.keys(violations).length === 0 ? (
        <p>No violation records found for this student.</p>
      ) : (
        Object.keys(violations).map((subcategoryName) => (
          <div key={subcategoryName}>
            <h4>{subcategoryName}</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Academic Year ID</th>
                  <th>Semester ID</th>
                  <th>Category ID</th>
                  <th>Offense ID</th>
                </tr>
              </thead>
              <tbody>
                {violations[subcategoryName].map((violation) => (
                  <tr key={violation.record_id}>
                    <td>{violation.record_id}</td>
                    <td>{violation.description}</td>
                    <td>{violation.created_at}</td>
                    <td>{violation.acadyear_id}</td>
                    <td>{violation.semester_id}</td>
                    <td>{violation.category_id}</td>
                    <td>{violation.offense_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default SubcategoryTable;
