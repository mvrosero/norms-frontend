import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewHistoryModal from '../modals/ViewHistoryModal';

const UniformDefianceHistoryTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [selectedRecord, setSelectedRecord] = useState(null); 
    const navigate = useNavigate();


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortOrderDate, setSortOrderDate] = useState('asc'); 


    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Fetch the uniform defiances
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


    // Handle redirect to selected uniform defiance slip
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
                        <th style={{ width: '23%' }}>
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
                        {currentDefiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{new Date(defiance.updated_at).toLocaleString()}</td> 
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
                                    <span onClick={() => handleShowDetailsModal(defiance)} style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
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


  return (
    <div>
        {renderTable()}

        {renderPagination()}

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
