import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import styled from '@emotion/styled';

const StyledTableContainer = styled.div`
  margin-bottom: 40px;
`;

const ViolationRecords = () => {
  const { student_idnumber } = useParams();
  const [records, setRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState({});

  // Fetch violation records based on student_idnumber
  useEffect(() => {
    const fetchViolationRecords = async () => {
      try {
        const response = await axios.get(
          `https://test-backend-api-2.onrender.com/myrecords-history/${student_idnumber}`
        );
        const records = response.data;

        // Group records by department_name and program_name
        const grouped = records.reduce((acc, record) => {
          const key = `${record.department_name} - ${record.program_name}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(record);
          return acc;
        }, {});

        setGroupedRecords(grouped);
      } catch (error) {
        console.error('Error fetching violation records:', error);
      }
    };

    fetchViolationRecords();
  }, [student_idnumber]);

  
  return (
    <div>
      {Object.entries(groupedRecords).map(([group, records]) => (
        <StyledTableContainer key={group}>
          <h3>{group}</h3>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Offense</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Subcategory</th>
                <th>Sanctions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.created_at).toLocaleDateString()}</td>
                  <td>{record.description}</td>
                  <td>{record.category_name}</td>
                  <td>{record.offense_name}</td>
                  <td>{record.semester_name}</td>
                  <td>{record.academic_year}</td>
                  <td>{record.subcategory_name}</td>
                  <td>{record.sanction_names}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </StyledTableContainer>
      ))}
    </div>
  );
};

export default ViolationRecords;
