import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import styled from '@emotion/styled';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../../styles/General.css';

const UniformDefianceTable = ({ show, filters, searchQuery }) => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [natures, setNatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [employeeName, setEmployeeName] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [fileMetadata, setFileMetadata] = useState([]);
    const [fileLoading, setFileLoading] = useState(true); 
    const [fileErrors, setFileErrors] = useState({});
    const [isFileClicked, setIsFileClicked] = useState(false);
    const [clickedFile, setClickedFile] = useState('');
    const navigate = useNavigate();


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortOrderDate, setSortOrderDate] = useState('asc');

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setFileMetadata([]);
            setFileLoading(true); 
            setFileErrors({});
            setIsFileClicked(false);
            setClickedFile('');
        }
    }, [show]);

        // Fetch file metadata when record changes
        useEffect(() => {
            if (selectedRecord) {
                setFileMetadata([]);
                const { photo_video_filenames } = selectedRecord;
                const filenames = photo_video_filenames.split(",");
    
                // Fetch metadata for all files
                const fetchMetadata = async () => {
                    const metadataPromises = filenames.map(async (filename) => {
                        const fileId = filename.trim();
                        const fileUrl = `https://test-backend-api-2.onrender.com/uniform_defiance/${fileId}`;
    
                        // Set the file as loading before fetching it
                        try {
                            const response = await fetch(fileUrl);
                            const contentType = response.headers.get("Content-Type");
                            return {
                                fileId,
                                fileUrl,
                                contentType,
                            };
                        } catch (error) {
                            console.error(`Failed to fetch metadata for file: ${fileId}`, error);
                            return { fileId, fileUrl, error: true };
                        }
                    });
    
                    const metadata = await Promise.all(metadataPromises);
                    setFileMetadata(metadata);
                    setFileLoading(false); 
                };
    
                fetchMetadata();
            }
        }, [selectedRecord]);
    
    
        // Handles zoom in of selected file
        const handleFileClick = (fileId, fileUrl) => {
            setClickedFile(fileUrl);
            setIsFileClicked(true);
        };
    
        const closeFullFileView = () => {
            setIsFileClicked(false);
            setClickedFile('');
        };
    
        const handleFileLoad = (fileId) => {
            setFileErrors((prev) => ({ ...prev, [fileId]: false }));
        };
    
        const handleFileError = (fileId) => {
            setFileErrors((prev) => ({ ...prev, [fileId]: true }));
        };
    
    
        // Render the file attachments
        const renderFiles = () => {
            if (fileLoading) {
                // Show the spinner if the files are still loading
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <div style={{ width: '50px', height: '50px', border: '6px solid #f3f3f3', borderTop: '6px solid #a9a9a9', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                );
            }
    
            return fileMetadata.map(({ fileId, fileUrl, contentType, error }) => {
                if (error) {
                    return (
                        <p key={fileId} style={{ color: "red", marginBottom: "10px" }}>
                            Failed to load file: {fileId}
                        </p>
                    );
                }
    
                const fileExtension = contentType?.split("/")[1]?.toLowerCase();
    
                if (
                    ["mp4", "avi", "mov", "mkv", "hevc"].includes(fileExtension) ||
                    contentType === "video/quicktime"
                ) {
                    return (
                        <div key={fileId} style={{ marginBottom: "10px" }}>
                            <video
                                controls
                                src={fileUrl}
                                style={{ maxWidth: "100%" }}
                                onLoad={() => handleFileLoad(fileId)} 
                                onError={() => handleFileError(fileId)} 
                            />
                        </div>
                    );
                } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
                    return (
                        <div key={fileId} style={{ marginBottom: "10px" }}>
                            <img
                                src={fileUrl}
                                alt="File Preview"
                                style={{ maxWidth: "100%", cursor: "pointer" }}
                                onLoad={() => handleFileLoad(fileId)} 
                                onError={() => handleFileError(fileId)} 
                                onClick={() => handleFileClick(fileId, fileUrl)}
                            />
                        </div>
                    );
                } else {
                    return (
                        <p key={fileId} style={{ color: "red", marginBottom: "10px" }}>
                            Unsupported file format: {fileId}
                        </p>
                    );
                }
            });
        };
    

    // Fetch uniform defiances
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeIdNumber = localStorage.getItem('employee_idnumber');
                if (!employeeIdNumber) {
                    throw new Error('Employee ID number not found in local storage');
                }

                const response = await axios.get(
                    `https://test-backend-api-2.onrender.com/uniform_defiances/submitted_by/${employeeIdNumber}`,
                    { headers }
                );
                setRecords(response.data);
                setFilteredRecords(response.data); // Initialize filtered records
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [headers]);


    // Fetch violation natures
    const fetchNatures = useCallback(async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/violation-natures', { headers });
            setNatures(response.data);
        } catch (error) {
            console.error('Error fetching nature of violations:', error);
            Swal.fire('Error', 'Failed to fetch nature of violations.', 'error');
        }
    }, [headers]);

    useEffect(() => {
        fetchNatures();
    }, [fetchNatures]);


        // Fetch the employee
        const fetchEmployeeName = async (employeeIdNumber) => {
        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/employees/${employeeIdNumber}`);
            return response.data.name;
        } catch (error) {
            console.error('Error fetching employee data:', error);
            return 'Unknown Employee'; 
        }
    };


    const handleViewDetails = async (record) => {
        setSelectedRecord(record);
        const name = await fetchEmployeeName(record.submitted_by);
        setEmployeeName(name);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
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


    // Sort records based on slip_id
    const handleSortSlipId = () => {
        const sortedRecords = [...records];
        sortedRecords.sort((a, b) => {
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
            setRecords(sortedRecords);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
        };

    // Sort defiances based on id_number
    const handleSort = (key) => {
        const sortedRecords = [...records];
        sortedRecords.sort((a, b) => {
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
        setRecords(sortedRecords);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        };

        const handleSortDate = () => {
            const sortedRecords = [...records];
            sortedRecords.sort((a, b) => {
                const dateA = new Date(a.updated_at); 
                const dateB = new Date(b.updated_at);
        
                return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
            });
            setRecords(sortedRecords);
            setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
        };


    // Pagination logic
    const indexOfLastRecord = currentPage * rowsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(records.length / rowsPerPage);   

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
                        <label htmlFor="rowsPerPage" style={{ marginLeft: '80px', marginRight: '5px' }}>Results per page:</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
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
    

    // Style for the view button
    const ViewButton = styled.button`
        border-radius: 20px;
        background: linear-gradient(45deg, #015901, #006637, #4AA616);
        color: white;
        border: none;
        padding: 5px 30px;
        cursor: pointer;
        text-align: center;
        &:hover {
            background: linear-gradient(45deg, #4AA616, #006637, #015901);
        }
    `;


// Render uniform defiance history table
const renderTable = () => {

    const filteredRecords = records.filter(record => {
         
        const nature = record.nature_name ? record.nature_name.toLowerCase() : '';
        const matchesSearchQuery = nature.includes(searchQuery.toLowerCase()) || 
            record.slip_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) || 
            record.student_idnumber.toString().toLowerCase().includes(searchQuery.toLowerCase());
    
        const matchesFilters = Object.keys(filters).every(key => {
          if (filters[key]) {  
            if (key === 'nature' && nature !== filters[key].toLowerCase()) return false;
            if (key === 'status' && record.status !== filters[key]) return false;
            if (key === 'filterDate' && new Date(record.created_at).getTime() !== new Date(filters[key]).getTime()) return false;
          }
          return true;
        });
        return matchesSearchQuery && matchesFilters; 
      });
    
      const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

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
        <div>
            {/* Table for larger screens */}
            <div style={{ overflowX: 'auto' }}>
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '75px', marginTop: '10px' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
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
                                <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '13%' }}>
                                    <button  style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                        onClick={() => handleSort('student_idnumber')}>
                                        ID Number {sortOrder === 'asc' ? 
                                        <ArrowDropUpIcon /> : 
                                        <ArrowDropDownIcon />}
                                    </button>
                                </th>
                                <th>Nature of Violation</th>
                                <th style={{ width: '14%' }}>Status</th>
                                <th style={{ width: '14%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredRecords?.length > 0 ? (
                        currentRecords.map((record, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{record.slip_id}</td>
                                    <td>{new Date(record.created_at).toLocaleString('en-US', { timeZone: 'UTC' })}</td>
                                    <td>{record.student_idnumber}</td>
                                    <td>{record.nature_name}</td> 
                                    <td style={{ textAlign: 'center' }}>{renderStatus(record.status)}</td>
                                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                                        <ViewButton onClick={() => handleViewDetails(record)}>
                                            View
                                        </ViewButton>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No uniform defiances found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
            </div>
        </div>
        );
    };
    
            

return (
    <div>
            {renderTable()}

            {!loading && renderPagination()}

            {/*View Uniform Defiance Modal*/}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
                <Modal.Header>
                    <Button variant="link" onClick={handleCloseDetailsModal} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none',fontSize: '30px', color: '#a9a9a9' }}>
                        ×
                    </Button>
                    <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW UNIFORM DEFIANCE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                            <p style={{ fontWeight: 'bold' }}>Slip ID:</p>
                            <p>{selectedRecord.slip_id}</p>
                            
                            <p style={{ fontWeight: 'bold' }}>Student ID Number:</p>
                            <p>{selectedRecord.student_idnumber}</p>

                            <p style={{ fontWeight: 'bold' }}>Nature of Violation:</p>
                            <p>{selectedRecord.nature_name}</p>
                            
                            <p style={{ fontWeight: 'bold' }}>Files Attached:</p>
                            <div>{renderFiles()}</div>

                            <p style={{ fontWeight: 'bold' }}>Status:</p>
                            <p>{renderStatus(selectedRecord.status)}</p>

                            <p style={{ fontWeight: 'bold' }}>Date Created:</p>
                            <p>
                                {selectedRecord.created_at
                                    ? `${new Date(selectedRecord.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        timeZone: 'UTC',
                                    })}, ${new Date(selectedRecord.created_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                        timeZone: 'UTC',
                                    })}`
                                    : 'N/A'}
                            </p>

                            <p style={{ fontWeight: 'bold' }}>Date Updated:</p>
                            <p>
                            {selectedRecord.created_at
                                ? `${new Date(selectedRecord.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}, ${new Date(selectedRecord.updated_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true,
                                })}`
                                : 'N/A'}
                            </p>

                            <p style={{ fontWeight: 'bold' }}>Submitted By:</p>
                            <p>{selectedRecord.full_name}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Full File Modal for Enlarged View */}
            <Modal show={isFileClicked} onHide={closeFullFileView} size="lg" backdrop="static" centered>
                <Modal.Header>
                    <Button variant="link" onClick={closeFullFileView} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                        ×
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <img src={clickedFile} alt="Enlarged Preview" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '5px' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};


export default UniformDefianceTable;
