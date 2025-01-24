import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Table, Modal, Button } from 'react-bootstrap';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const UserLogsTable = ({filters, searchQuery}) => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const navigate = useNavigate();


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    // Sorting state for id and date
    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortOrderDate, setSortOrderDate] = useState('desc'); 


    // Fetch data from histories table
    useEffect(() => {
        const fetchHistories = async () => {
        try {
            const response = await fetch('https://test-backend-api-2.onrender.com/histories');
            if (!response.ok) {
            throw new Error('Failed to fetch histories');
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
            setHistories(sortedData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        };
        fetchHistories();
    }, []);
  

    // Generate action sentences for the actions taken field
    const generateActionSentence = (history) => {
        const changes = [];

        if (history.old_department_id !== history.new_department_id) {
        changes.push(`The department was changed from ${history.old_department_name} to ${history.new_department_name}`);
        }
        if (history.old_program_id !== history.new_program_id) {
        changes.push(`The program was changed from ${history.old_program_name} to ${history.new_program_name}`);
        }
        if (history.old_year_level !== history.new_year_level) {
        changes.push(`The year level was changed from ${history.old_year_level} to ${history.new_year_level}`);
        }
        if (history.old_status !== history.new_status) {
        changes.push(`The status was changed from ${history.old_status} to ${history.new_status}`);
        }
        if (history.old_batch !== history.new_batch) {
        changes.push(`The batch was changed from ${history.old_batch} to ${history.new_batch}`);
        }
        if (history.old_role_id !== history.new_role_id) {
        changes.push(`The role was changed from ${history.old_role_name} to ${history.new_role_name}`);
        }

        const actionSentence = changes.join(' ') || 'No changes recorded';
        return `${actionSentence} of ${history.user}.`.replace(/\s+\./, '.');
    };

    
    const handleShowModal = (history) => {
        setSelectedHistory(history);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHistory(null);
    };


    // Sort histories based on history_id
    const handleSortHistoryId = () => {
    const sortedHistories = [...histories];
    sortedHistories.sort((a, b) => {
            const historyIdA = parseInt(a.history_id, 10);
            const historyIdB = parseInt(b.history_id, 10);
    
            if (isNaN(historyIdA) || isNaN(historyIdB)) {
                return 0; 
            }
    
            if (sortOrder === 'asc') {
                return historyIdA - historyIdB; 
            } else {
                return historyIdB - historyIdA; 
            }
        });
        setHistories(sortedHistories);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
    };

    const handleSortDate = () => {
        const sortedHistories = [...histories];
        sortedHistories.sort((a, b) => {
            const dateA = new Date(a.changed_at).getTime();  
            const dateB = new Date(b.changed_at).getTime();  
    
            return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setHistories(sortedHistories);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
    };


    // Pagination logic
    const indexOfLastHistory = currentPage * rowsPerPage;
    const indexOfFirstHistory = indexOfLastHistory - rowsPerPage;
    const currentHistories = histories.slice(indexOfFirstHistory, indexOfLastHistory);
    const totalPages = Math.ceil(histories.length / rowsPerPage);   

    const handlePaginationChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
        };

    const renderPagination = () => {
        if (loading) return null;
        
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: '#4a4a4a'}}>
                {/* Results per Page */}
                <div>
                    <label htmlFor="rowsPerPage" style={{ marginLeft: '120px', marginRight: '5px' }}>Results per page:</label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        style={{ fontSize: '14px', padding: '5px 25px', border: '1px solid #ccc', borderRadius: '3px' }}>
                        {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                            <option key={value} value={value}> {value} </option>
                        ))}
                    </select>
                </div>
        
                {/* Pagination Info and Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
                    {/* Page Info */}
                    <div style={{ marginRight: '10px' }}>Page {currentPage} of {totalPages}</div>
        
                    {/* Pagination Buttons */}
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


  const renderTable = () => {

    const filteredHistories = histories.filter((history) => {
        const normalizedQuery = searchQuery.toLowerCase();
    
        // Generate action sentence for search query comparison
        const actionSentence = generateActionSentence(history).toLowerCase();
    
        // Check if the search query matches `updated_by`, `history_id`, or the generated action sentence
        const matchesQuery =
            history.updated_by?.toLowerCase().includes(normalizedQuery) ||
            history.history_id?.toString().toLowerCase().includes(normalizedQuery) ||
            actionSentence.includes(normalizedQuery);
    
        // Standardize and compare `changed_at` dates
        const matchesDate = filters.changedAt
            ? new Date(history.changed_at).toISOString().split('T')[0] === new Date(filters.changedAt).toISOString().split('T')[0]
            : true;
    
        return matchesQuery && matchesDate;
    });
    
    const currentHistories = filteredHistories.slice(indexOfFirstHistory, indexOfLastHistory);


    if (loading) {
        // Loading spinner while data is still being fetched
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "6px solid #f3f3f3",
                borderTop: "6px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        );
      }

    
    return (
      <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '100px' }}>
        <thead>
          <tr>
          <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '5%' }}>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                    onClick={handleSortHistoryId}
                    >
                    <span style={{ textAlign: 'center', width: '15%' }}>ID</span>
                    {sortOrder === 'asc' ? (
                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                    ) : (
                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                    )}
                </button>
            </th>
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
            <th>Actions Taken</th>
            <th style={{ width: '15%' }}>Updated By</th>
            <th style={{ width: '8%' }}>Details</th>
          </tr>
        </thead>
        <tbody>
        {filteredHistories?.length > 0 ? (
         currentHistories.map((history, index) => (
            <tr key={history.history_id}>
              <td style={{ textAlign: 'center' }}>{history.history_id}</td>
              <td>
                {new Date(history.changed_at).toISOString().split('T')[0]}, 
                {' '}
                {new Date(history.changed_at).toLocaleTimeString()} 
              </td>
              <td>{generateActionSentence(history)}</td>
              <td>{history.updated_by}</td>
              <td style={{ textAlign: 'center' }}>
                <div onClick={() => handleShowModal(history)} style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }}>
                  View
                </div>
              </td>
            </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No user logs found</td>
                </tr>
            )}
        </tbody>
      </Table>
    );
  };


  return (
    <div>
      {renderTable()}

      {!loading && renderPagination()}

      {/* View User Log Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop='static'>
        <Modal.Header>
          <Button
            variant="link"
            onClick={handleCloseModal}
            style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}
          >
            ×
          </Button>
          <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW USER LOG DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHistory && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '60px', marginRight: '20px' }}>
              <p style={{ fontWeight: 'bold' }}>History ID:</p>
              <p>{selectedHistory.history_id}</p>

              <p style={{ fontWeight: 'bold' }}>Date:</p>
              <p>{new Date(selectedHistory.changed_at).toLocaleString()}</p>

              <p style={{ fontWeight: 'bold' }}>User:</p>
              <p>{selectedHistory.user}</p>

              <p style={{ fontWeight: 'bold' }}>Actions Taken:</p>
              <p style={{ textAlign: 'justify' }}>{generateActionSentence(selectedHistory)}</p>

              <p style={{ fontWeight: 'bold' }}>Updated By:</p>
              <p>{selectedHistory.updated_by}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};


export default UserLogsTable;
