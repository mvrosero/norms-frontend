import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewRecordModal from '../modals/ViewRecordModal';

const SubcategoryTable = () => {
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting states
  const [sortOrderDate, setSortOrderDate] = useState('asc');

  useEffect(() => {
    const fetchViolationRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in');
          setLoading(false);
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const studentId = decodedToken.student_idnumber;

        if (!studentId) {
          setError('No student ID found in the token');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:9000/student-myrecords/subcategory/${studentId}`
        );
        setRecords(response.data);
      } catch (err) {
        setError('Error fetching violation records');
      } finally {
        setLoading(false);
      }
    };

    fetchViolationRecords();
  }, []);

  // Sort records based on date
  const handleSortDate = () => {
    const sortedRecords = { ...records };
    Object.keys(sortedRecords).forEach((subcategoryName) => {
      sortedRecords[subcategoryName].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
      });
    });
    setRecords(sortedRecords);
    setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
  };

  // Pagination Logic
  const paginateRecords = (subcategoryRecords) => {
    const indexOfLastRecord = currentPage * rowsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
    return subcategoryRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  const totalPages = Math.ceil(
    Object.values(records)
      .flat()
      .length / rowsPerPage
  );

  const handlePaginationChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const buttonStyle = {
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #a0a0a0',
      backgroundColor: '#ebebeb',
      color: '#4a4a4a',
      fontSize: '0.75rem',
      cursor: 'pointer',
    };

    const activeButtonStyle = {
      ...buttonStyle,
      backgroundColor: '#a0a0a0',
      color: '#f1f1f1',
    };

    const disabledButtonStyle = {
      ...buttonStyle,
      backgroundColor: '#ebebeb',
      color: '#a1a1a1',
      cursor: 'not-allowed',
    };

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '15px',
          fontSize: '14px',
          color: '#4a4a4a',
        }}
      >
        {/* Results per Page */}
        <div>
          <label
            htmlFor="rowsPerPage"
            style={{ marginLeft: '120px', marginRight: '5px' }}
          >
            Results per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{
              fontSize: '14px',
              padding: '5px 25px',
              border: '1px solid #ccc',
              borderRadius: '3px',
            }}
          >
            {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Info and Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
          <div style={{ marginRight: '10px' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div style={{ display: 'flex' }}>
            <button
              onClick={() =>
                currentPage > 1 && handlePaginationChange(currentPage - 1)
              }
              disabled={currentPage === 1}
              style={{
                ...buttonStyle,
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                ...(currentPage === 1 ? disabledButtonStyle : {}),
              }}
            >
              ❮
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePaginationChange(number)}
                style={number === currentPage ? activeButtonStyle : buttonStyle}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() =>
                currentPage < totalPages && handlePaginationChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              style={{
                ...buttonStyle,
                borderTopRightRadius: '10px',
                borderBottomRightRadius: '10px',
                ...(currentPage === totalPages ? disabledButtonStyle : {}),
              }}
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    );
  };

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
      {Object.keys(records).length === 0 ? (
        <p>No violation records found for this subcategory.</p>
      ) : (
        Object.keys(records).map((subcategoryName) => (
          <div key={subcategoryName}>
            <h4>{subcategoryName}</h4>
            <Table
              bordered
              hover
              responsive
              style={{
                borderRadius: '20px',
                marginTop: '10px',
                marginBottom: '20px',
                marginLeft: '110px',
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>No.</th>
                  <th style={{ width: '20%' }}>
                    <button
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
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
                {paginateRecords(records[subcategoryName]).map((record, index) => (
                  <tr key={record.record_id}>
                    <td>{index + 1}</td>
                    <td>{record.created_at}</td>
                    <td>{record.category_name}</td>
                    <td>{record.offense_name}</td>
                    <td>
                                        {record.sanction_names.length > 0
                                            ? record.sanction_names.join(', ')
                                            : 'No sanctions'}
                                    </td>
                    <td>
                      <Button
                        onClick={() => setSelectedRecord(record)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {renderPagination()}
          </div>
        ))
      )}
    </div>
  );
};

export default SubcategoryTable;
