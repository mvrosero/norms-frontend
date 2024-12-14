import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewHistoryModal from '../modals/ViewHistoryModal';

const UniformDefianceHistoryTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false); 
    const [showModal, setShowModal] = useState(false); 
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

    const fetchDefiances = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });

                const fuse = new Fuse(response.data, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'photo_video_filename', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4,
                });

                const searchResults = fuse.search(searchQuery);
                const filteredDefiances = searchResults
                    .map(result => result.item)
                    .filter(defiance => defiance.status !== 'pending');

                setDefiances(filteredDefiances);
            } else {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
                const nonPendingDefiances = response.data.filter(defiance => defiance.status !== 'pending');
                setDefiances(nonPendingDefiances);
            }
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

    const deleteDefiance = async (slipId) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });
        if (!isConfirm) {
            return;
        }

        try {
            await axios.delete(`http://localhost:9000/uniform_defiance/${slipId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: 'Defiance has been deleted.',
            });
            setDefiances(prevDefiances => prevDefiances.filter(defiance => defiance.slip_id !== slipId));
        } catch (error) {
            console.error('Error deleting defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting defiance. Please try again later.',
            });
        }
    };

    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const handleCloseDetailsModal = () => {
        setSelectedRecord(null);
        setShowModal(false);
    };


    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'approved') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'rejected') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else if (status === 'pending') {
            backgroundColor = '#FFF5DC';
            textColor = '#FFC107';
        } else {
            backgroundColor = '#EDEDED';
            textColor = '#6C757D'; 
        }

        return (
            <div style={{
                backgroundColor,
                color: textColor,
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: '30px',
                padding: '5px 20px',
                display: 'inline-flex',
                alignItems: 'center',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: textColor,
                    marginRight: '7px',
                }} />
                {status}
            </div>
        );
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


        // Sort defiances based on id_number
        const handleSort = (key) => {
            const sortedDefiances = [...defiances];
            sortedDefiances.sort((a, b) => {
              const valueA = a[key];
              const valueB = b[key];
          
              if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortOrder === 'asc'
                  ? valueA.localeCompare(valueB)
                  : valueB.localeCompare(valueA);
              } else {
                return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
              }
            });
          
            setDefiances(sortedDefiances);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
                    <thead>
                        <tr>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '5%' }}>
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
                            <th style={{ width: '20%' }}>Date</th>
                            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '13%' }}>
                                <button onClick={() => handleSort('student_idnumber')}>
                                    ID Number {sortOrder === 'asc' ? 
                                    <ArrowDropUpIcon /> : 
                                    <ArrowDropDownIcon />}
                                </button>
                            </th>
                            <th>Nature of Violation</th>
                            <th style={{ width: '10%' }}>Details</th>
                            <th style={{ width: '13%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDefiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{new Date(defiance.created_at).toLocaleString()}</td> 
                                <td style={{ textAlign: 'center' }}>
                                    <Link 
                                        to={`/individualuniformdefiance/${defiance.student_idnumber}`}
                                        style={{ textDecoration: 'underline', color: 'black' }}
                                    >
                                        {defiance.student_idnumber}
                                    </Link>
                                </td>
                                <td>{defiance.nature_name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span 
                                        onClick={() => handleShowDetailsModal(defiance)} 
                                        style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                                    >
                                        View
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(defiance.status)}</td>
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

        {/* Use the imported ViewHistoryModal instead of inline modal */}
        <ViewHistoryModal 
            show={showModal} 
            onHide={handleCloseDetailsModal} 
            selectedRecord={selectedRecord} 
            />
      </div>
    );
};


export default UniformDefianceHistoryTable;
