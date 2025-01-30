import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewViolationRecordModal from '../../student/modals/ViewViolationRecordModal';
import styled from '@emotion/styled';

const StyledTableContainer = styled.div`
  margin-bottom: 20px;
`;

export default function MyRecordsHistoryTable({ filters, searchQuery }) {
    const [groupedRecords, setGroupedRecords] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Sorting states
    const [sortOrderDate, setSortOrderDate] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const studentIdNumber = localStorage.getItem('student_idnumber');
                if (!studentIdNumber) {
                    throw new Error('Student ID number not found in local storage');
                }

                // Fetch violation records
                const recordsResponse = await axios.get(
                    `https://test-backend-api-2.onrender.com/violationrecords-history/${studentIdNumber}`
                );
                const records = recordsResponse.data;

                // Group records by department_name and program_name
                const grouped = records.reduce((acc, record) => {
                    const key = `${record.department_name} - ${record.program_name}`;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(record);
                    return acc;
                }, {});

                // Set state with grouped records
                setGroupedRecords(grouped);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Sort records based on date inside each group
    const handleSortDate = () => {
        const sortedGroupedRecords = { ...groupedRecords };

        // Loop through each group and sort the records by date
        Object.keys(sortedGroupedRecords).forEach((group) => {
            const sortedRecords = [...sortedGroupedRecords[group]];
            sortedRecords.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);

                return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
            });
            sortedGroupedRecords[group] = sortedRecords;
        });

        setGroupedRecords(sortedGroupedRecords);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
    };

    const buttonStyles = {
        borderRadius: '20px',
        background: 'linear-gradient(45deg, #015901, #006637, #4AA616)',
        color: 'white',
        border: 'none',
        padding: '5px 30px',
        cursor: 'pointer',
        textAlign: 'center',
    };

// Render the violation record modal
const renderTable = () => {
    // Show loading spinner when data is being fetched
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <div style={{ width: "50px", height: "50px", border: "6px solid #f3f3f3", borderTop: "6px solid #a9a9a9", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <style> {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`} </style>
        </div>
      );
    }


  return (
    <div style={{ paddingTop: '10px' }}>
      {Object.entries(groupedRecords).map(([group, records]) => {
        // Filter the records based on search query and filters
        const filteredRecords = records.filter(record => {
          const category = record.category_name.toLowerCase();
          const semester = record.semester_name.toLowerCase();
          const offense = record.offense_name ? record.offense_name.toLowerCase() : '';
          
          // Check if offense matches the search query
          const matchesSearchQuery = offense.includes(searchQuery.toLowerCase());
  
          // Check if filters match
          const matchesFilters = Object.keys(filters).every(key => {
            if (filters[key]) {
              if (key === 'category' && category !== filters[key].toLowerCase()) return false;
              if (key === 'academic_year' && record.academic_year !== filters[key].toLowerCase()) return false;
              if (key === 'semester' && semester !== filters[key].toLowerCase()) return false;
            }
            return true;
          });

          return matchesSearchQuery && matchesFilters;
        });
        

  return (
    <StyledTableContainer key={group}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', marginLeft: '120px' }}>{group}</h3>
          <Table bordered hover responsive style={{ borderRadius: '20px', marginLeft: '110px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                            <th style={{ width: '5%' }}>No.</th>
                            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '20%' }}>
                                <button
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
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
                            <th style={{ width: '13%' }}>Category</th>
                            <th>Offense</th>
                            <th style={{ width: '25%' }}>Sanctions</th>
                            <th style={{ width: '10%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>
                                    {(index + 1)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {new Date(record.created_at).toLocaleString()}
                                </td>
                                <td>{record.category_name}</td>
                                <td>{record.offense_name}</td>
                                <td>{record.sanction_names}</td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button style={buttonStyles} onClick={() => setSelectedRecord(record)}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No violation records found</td>
                        </tr>
                        )}
                </tbody>
            </Table>
            </StyledTableContainer>
                );
            })}
        </div>
    );
};


return (
    <div>
            {renderTable()}

            {/* View Record Modal */}
            {selectedRecord && (
                <ViewViolationRecordModal
                    show={selectedRecord !== null}
                    onHide={() => setSelectedRecord(null)}
                    record={selectedRecord}
                />
            )}
        </div>
    );
}
