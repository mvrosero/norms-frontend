import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewHistoryModal from '../modals/ViewHistoryModal';

const UniformDefianceHistoryTable = ({filters, searchQuery}) => {
    const [defiances, setDefiances] = useState([]);
    const [natures, setNatures] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [selectedRecord, setSelectedRecord] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name and date
    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortOrderDate, setSortOrderDate] = useState('asc'); 


    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Fetch the employees
    const fetchEmployeeName = async (employee_idnumber) => {
        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/employees/${employee_idnumber}`, { headers });
            return response.data.name;
        } catch (error) {
            console.error('Error fetching employee name:', error);
            return 'Unknown';
        }
    };

    // Fetch the students
    const fetchNatures = useCallback(async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/violation-natures', { headers });
            setNatures(response.data);
        } catch (error) {
            console.error('Error fetching nature of violations:', error);
            Swal.fire('Error', 'Failed to fetch nature of violations.', 'error');
        }
    }, [headers]);


    // Fetch the uniform defiances
    const fetchDefiances = useCallback(async () => {
        setLoading(true);  
        setError(null);    

        try {
            let response = await axios.get('https://test-backend-api-2.onrender.com/uniform_defiances', { headers });
            let data = response.data;

            // Filter out 'pending' status
            data = data.filter(defiance => defiance.status !== 'pending');

            // Fetch employee names and update the data
            const updatedData = await Promise.all(data.map(async (defiance) => {
                const fullName = await fetchEmployeeName(defiance.submitted_by);
                return { ...defiance, submitted_by: fullName };
            }));
            setDefiances(updatedData);
        } catch (error) {
            console.error('Error fetching defiances:', error);
            setError('Failed to fetch uniform defiances.');  
        } finally {
            setLoading(false);  
        }
    }, [headers]);
    useEffect(() => {
        fetchDefiances();
        fetchNatures();
    }, [fetchNatures, fetchDefiances]);


    // Handle redirect to selected uniform defiance slip
    const handleRedirect = async (slip_id) => {
        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/uniform_defiance/${slip_id}`);
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


    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const handleCloseDetailsModal = () => {
        setSelectedRecord(null);
        setShowModal(false);
    };


    // Set the styles for the status
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
                const slipIdA = parseInt(a.slip_id, 10);
                const slipIdB = parseInt(b.slip_id, 10);
        
                if (isNaN(slipIdA) || isNaN(slipIdB)) {
                    return 0; 
                }
        
                if (sortOrder === 'asc') {
                    return slipIdA - slipIdB; 
                } else {
                    return slipIdB - slipIdA; 
                }
            });
            setDefiances(sortedDefiances);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
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

        const handleSortDate = () => {
            const sortedDefiances = [...defiances];
            sortedDefiances.sort((a, b) => {
                const dateA = new Date(a.updated_at); 
                const dateB = new Date(b.updated_at);
        
                return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
            });
            setDefiances(sortedDefiances);
            setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
        };


     // Pagination logic
    const indexOfLastDefiance = currentPage * rowsPerPage;
    const indexOfFirstDefiance = indexOfLastDefiance - rowsPerPage;
    const currentDefiances = defiances.slice(indexOfFirstDefiance, indexOfLastDefiance);
    const totalPages = Math.ceil(defiances.length / rowsPerPage);   

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


// Render uniform defiance history table
const renderTable = () => {

    const filteredDefiances = defiances.filter(defiance => {
         
        const nature = defiance.nature_name ? defiance.nature_name.toLowerCase() : '';
        const matchesSearchQuery = nature.includes(searchQuery.toLowerCase()) || 
                                   defiance.student_idnumber.toString().toLowerCase().includes(searchQuery.toLowerCase());
    
        const matchesFilters = Object.keys(filters).every(key => {
          if (filters[key]) {  
            if (key === 'nature' && nature !== filters[key].toLowerCase()) return false;
            if (key === 'status' && defiance.status !== filters[key]) return false;
            if (key === 'filterDate' && new Date(defiance.created_at).getTime() !== new Date(filters[key]).getTime()) return false;
          }
          return true;
        });
        return matchesSearchQuery && matchesFilters; 
      });
    
      const currentDefiances = filteredDefiances.slice(indexOfFirstDefiance, indexOfLastDefiance);

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
        <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px', marginTop: '10px' }}>
            <thead>
                    <tr>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '5%' }}>
                            <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
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
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '23%' }}>
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
                        {filteredDefiances?.length > 0 ? (
                        currentDefiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{new Date(defiance.updated_at).toLocaleString()}</td> 
                                <td style={{ textAlign: 'center' }}>
                                    <Link 
                                        to={`/individualuniformdefiance/${defiance.student_idnumber}`}
                                        style={{ textDecoration: 'none', color: 'black', cursor: 'pointer', transition: 'color 0.3s ease, text-decoration 0.3s ease' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.textDecoration = 'underline'; 
                                            e.target.style.color = '#4682B4';  
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.textDecoration = 'none'; 
                                            e.target.style.color = 'black';  
                                        }}
                                    >
                                        {defiance.student_idnumber}
                                    </Link>
                                </td>
                                <td>{defiance.nature_name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span onClick={() => handleShowDetailsModal(defiance)} style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
                                        View
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(defiance.status)}</td>
                            </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No uniform defiances found</td>
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

        {/*View History Modal*/}
        <ViewHistoryModal 
            show={showModal} 
            onHide={handleCloseDetailsModal} 
            selectedRecord={selectedRecord} 
            />
      </div>
    );
};


export default UniformDefianceHistoryTable;
