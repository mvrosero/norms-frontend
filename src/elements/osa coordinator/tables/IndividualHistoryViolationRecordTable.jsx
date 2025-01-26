import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import styled from '@emotion/styled';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewViolationModal from '../modals/ViewViolationModal';


const StyledTableContainer = styled.div`
  margin-bottom: 40px;
`;

const IndividualHistoryViolationRecordTable = () => {
  const { student_idnumber } = useParams();
  const [records, setRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  // Sorting state for date
  const [sortOrderDate, setSortOrderDate] = useState('asc'); 

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


  // Sort records based on date
  const handleSortDate = () => {
      const sortedRecords = [...records];
      sortedRecords.sort((a, b) => {
          const dateA = new Date(a.created_at); 
          const dateB = new Date(b.created_at);

          return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
      });

      setRecords(sortedRecords);
      setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
  };


  // Handle opening and closing  the ViewViolationModal
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };


  // Styles for the view button
  const ViewButton = styled.button`
  border-radius: 20px;
  background: linear-gradient(45deg, #015901, #006637, #4aa616);
  color: white;
  border: none;
  padding: 5px 30px;
  cursor: pointer;
  &:hover {
      background: linear-gradient(45deg, #4aa616, #006637, #015901);
  }
`;


return (
  <div style={{ paddingTop: '10px' }}>
    {Object.entries(groupedRecords).map(([group, records]) => (
        <StyledTableContainer key={group}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>{group}</h3>
          <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ width: '5%' }}>No.</th>
                <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '20%' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        onClick={handleSortDate}
                        >
                        <span>Date</span>
                        {sortOrderDate === 'asc' ? (
                            <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                        ) : (
                            <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                        )}
                    </button>
                </th>
                <th style={{ width: '12%' }}>Category</th>
                <th>Offense</th>
                <th style={{ width: '13%' }}>Academic Year</th>
                <th style={{ width: '13%' }}>Semester</th>
                <th style={{ width: '12%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{new Date(record.created_at).toLocaleString()}</td>
                  <td>{record.category_name}</td>
                  <td>{record.offense_name}</td>
                  <td style={{ textAlign: 'center' }}>{record.academic_year}</td>
                  <td style={{ textAlign: 'center' }}>{record.semester_name}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <ViewButton onClick={() => handleViewDetails(record)}>View</ViewButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </StyledTableContainer>
      ))}

      {/* View Violation Modal */}
      <ViewViolationModal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};


export default IndividualHistoryViolationRecordTable;
