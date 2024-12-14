import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js';
import ViewUniformDefianceModal from '../modals/ViewUniformDefianceModal';

const UniformDefianceTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchEmployeeName = async (employee_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/employees/${employee_idnumber}`, { headers });
            return response.data.name;
        } catch (error) {
            console.error('Error fetching employee name:', error);
            return 'Unknown';
        }
    };

    const fetchDefiances = useCallback(async () => {
        try {
            let response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
            let data = response.data;

            // Filter data to include only those with status 'Pending'
            data = data.filter(defiance => defiance.status === 'pending');

            // Replace submitted_by with full name
            const updatedData = await Promise.all(data.map(async (defiance) => {
                const fullName = await fetchEmployeeName(defiance.submitted_by);
                return { ...defiance, submitted_by: fullName };
            }));

            if (searchQuery) {
                const fuse = new Fuse(updatedData, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4,
                });

                const searchResults = fuse.search(searchQuery);
                data = searchResults.map(result => result.item);
            } else {
                data = updatedData;
            }

            setDefiances(data);
        } catch (error) {
            console.error('Error fetching defiances:', error);
        }
    }, [headers, searchQuery]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);
    

    const handleRedirect = async (slip_id) => {
        try {
            const response = await axios.get(`http://localhost:9000/uniform_defiance/${slip_id}`);
            const defiance = response.data;
            localStorage.setItem('selectedDefiance', JSON.stringify(defiance));
            navigate(`/individualdefiancerecord/${slip_id}`);
        } catch (error) {
            console.error('Error fetching defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while fetching defiance data. Please try again later.',
            });
        }
    };

    const updateStatus = async (slipId, newStatus) => {
        try {
            await axios.put(`http://localhost:9000/uniform_defiance/${slipId}`, { status: newStatus }, { headers });
            Swal.fire({
                icon: 'success',
                text: `Successfully Updated to ${newStatus}`
            });
            setDefiances(prevDefiances => 
                prevDefiances.filter(defiance => defiance.slip_id !== slipId)
            );
        } catch (error) {
            console.error('Error updating defiance status:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while updating defiance status. Please try again later.',
            });
        }
    };

    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setSelectedRecord(null);
        setShowDetailsModal(false);
    };


    // Sort defiances based on slip_id
    const handleSortSlipId = () => {
        const sortedDefiances = [...defiances];
        sortedDefiances.sort((a, b) => {
                // Parse defiance_id as integers to ensure numeric sorting
                const slipIdA = parseInt(a.slip_id, 10);
                const slipIdB = parseInt(b.slip_id, 10);
        
                // Check if the parsed values are valid numbers
                if (isNaN(slipIdA) || isNaN(slipIdB)) {
                    return 0; // If the values are invalid, maintain the order
                }
        
                // Compare numeric values for sorting
                if (sortOrder === 'asc') {
                    return slipIdA - slipIdB; // Ascending order
                } else {
                    return slipIdB - slipIdA; // Descending order
                }
            });
            setDefiances(sortedDefiances);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
        };


    // Sort defiances based on idnumber
    const handleSortIdNumber = () => {
    const sortedDefiances = [...defiances];
    sortedDefiances.sort((a, b) => {
            // Parse student_idnumber as integers to ensure numeric sorting
            const idNumberA = parseInt(a.student_idnumber, 10);
            const idNumberB = parseInt(b.student_idnumber, 10);
    
            // Check if the parsed values are valid numbers
            if (isNaN(idNumberA) || isNaN(idNumberB)) {
                return 0; // If the values are invalid, maintain the order
            }
    
            // Compare numeric values for sorting
            if (sortOrder === 'asc') {
                return idNumberA - idNumberB; // Ascending order
            } else {
                return idNumberB - idNumberA; // Descending order
            }
        });
        setDefiances(sortedDefiances);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };


    // Calculate paginated defiances
    const indexOfLastDefiance = currentPage * rowsPerPage;
    const indexOfFirstDefiance = indexOfLastDefiance - rowsPerPage;
    const currentDefiances = defiances.slice(indexOfFirstDefiance, indexOfLastDefiance);

    const totalPages = Math.ceil(defiances.length / rowsPerPage);   

    // Handle pagination change
    const handlePaginationChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


        // Render Table
        const renderTable = () => {
            return (
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '6%' }}>
                                <button
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', 
                                    }}
                                    onClick={handleSortSlipId}
                                >
                                    <span style={{ textAlign: 'center' }}>ID</span>
                                    {sortOrder === 'asc' ? (
                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                    ) : (
                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                    )}
                                </button>
                                </th>
                            <th style={{ width: '20%' }}>Date Submitted</th>
                            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '13%' }}>
                                <button
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', 
                                    }}
                                    onClick={handleSortIdNumber}
                                >
                                    <span style={{ textAlign: 'center' }}>ID Number</span>
                                    {sortOrder === 'asc' ? (
                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                    ) : (
                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                    )}
                                </button>
                                </th>
                            <th>Nature of Violation</th>
                            <th style={{ width: '10%' }}>Actions</th>
                            <th style={{ width: '20%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDefiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{new Date(defiance.created_at).toLocaleString()}</td> 
                                <td>{defiance.student_idnumber}</td>
                                <td>{defiance.nature_name}</td>
                                <td>
                                    <div 
                                        className="ud-view-container" 
                                        style={{ cursor: 'pointer', textAlign: 'center', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }} 
                                        onClick={() => handleShowDetailsModal(defiance)}
                                    >
                                        View
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Button
                                            className='btn-success btn-md d-flex align-items-center ms-2'
                                            onClick={() => updateStatus(defiance.slip_id, 'approved')}
                                            style={{ 
                                                backgroundColor: '#28a745', // Bootstrap success color
                                                color: '#fff',
                                                border: '2px solid #28a745', // Border color matching fill color
                                                borderRadius: '25px',
                                                padding: '2px 10px' // Added padding for left and right
                                            }}
                                        >
                                            <CheckIcon style={{ marginRight: '5px' }} />
                                            Approve
                                        </Button>
                                        <Button
                                            className='btn-danger btn-md d-flex align-items-center ms-2'
                                            onClick={() => updateStatus(defiance.slip_id, 'rejected')}
                                            style={{ 
                                                backgroundColor: '#dc3545', // Bootstrap danger color
                                                color: '#fff',
                                                border: '2px solid #dc3545', // Border color matching fill color
                                                borderRadius: '25px',
                                                padding: '2px 10px' // Added padding for left and right
                                            }}
                                        >
                                            <CloseIcon style={{ marginRight: '5px' }} />
                                            Reject
                                        </Button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                );
            };

    
// Render Custom Pagination
const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    const buttonStyle = {
      width: '30px', // Fixed width for equal size
      height: '30px', // Fixed height for equal size
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #a0a0a0',
      backgroundColor: '#ebebeb',
      color: '#4a4a4a',
      fontSize: '0.75rem', // Smaller font size
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
          justifyContent: 'flex-end',
          marginBottom: '15px',
        }}
      >
        {/* Page Info */}
        <div style={{ fontSize: '0.875rem', color: '#4a4a4a', marginRight: '10px' }}>
          Page {currentPage} out of {totalPages}
        </div>
  
        {/* Pagination Buttons */}
        <div style={{ display: 'flex', marginRight: '20px' }}>
          <button
            onClick={() => currentPage > 1 && handlePaginationChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...buttonStyle,
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              ...(currentPage === 1 && disabledButtonStyle),
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
            onClick={() => currentPage < totalPages && handlePaginationChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              ...buttonStyle,
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              ...(currentPage === totalPages && disabledButtonStyle),
            }}
          >
            ❯
          </button>
        </div>
      </div>
    );
  };
  

    return (
        <div>
            {renderTable()}

            {/* Custom Pagination */}
            {renderPagination()}

             {/* View Defiance Modal */}
                <ViewUniformDefianceModal 
                    show={showDetailsModal} 
                    onHide={handleCloseDetailsModal} 
                    record={selectedRecord} 
                />
          </div>
        );
    };

export default UniformDefianceTable;
