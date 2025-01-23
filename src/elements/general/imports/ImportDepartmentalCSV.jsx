import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom'; 
import { Modal, Button, Table } from 'react-bootstrap';

import DescriptionIcon from '@mui/icons-material/Description';
import { BiSolidDownload } from "react-icons/bi";

const ImportDepartmentalCSV = () => {
    const [file, setFile] = useState(null);
    const { department_code } = useParams(); 
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);


    // Handle file selection
    const handleFileChange = (event) => {
        event.preventDefault();
        setLoading(true);

        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setTimeout(() => {
            setLoading(false); 
        }, 2000); 
    };


    // Handle file upload 
    const handleSubmit = async () => {
        if (!file) {
            Swal.fire('Error', 'Please select a CSV file first', 'error');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`https://test-backend-api-2.onrender.com/importcsv-departmental/${department_code}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                icon: 'success',
                text: 'Students have been added successfully!',
                timer: 3000, 
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    window.location.reload(); 
                },
            });
            setShowModal(false); 
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.error || 'An unknown error occurred';
                Swal.fire('Error', errorMessage, 'error');
            } else {
                Swal.fire('Error', 'Failed to import CSV. Please try again.', 'error');
            }
        }
    };


    const handleClickOpen = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleModalClick = (event) => {
        if (event.target.closest('.modal-content')) {
            return;
        }
        setShowModal(false);
    };


    // Set the styles for the modal
    const buttonStyle = {
        backgroundColor: '#FAD32E',
        color: '#FFFFFF',
        fontWeight: '900',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginBottom: '20px',
        marginRight: '20px', 
        display: 'inline-block',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const cancelButtonStyle = {
        backgroundColor: '#8C8C8C',
        color: '#FFFFFF',
        fontWeight: '900',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '10px',
        marginRight: '10px',
        marginBottom: '20px',
        cursor: 'pointer',
        display: 'inline-block',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const whiteButtonStyle = {
        backgroundColor: '#FFFFFF',
        color: '#0D4809',
        fontWeight: '600',
        fontSize: '12px',
        padding: '12px 25px',
        border: '1px solid #e8e8e8',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '5px', 
        display: 'inline-block',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.3)',
    };

    const timelineStyle = {
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        marginBottom: '20px',
        paddingLeft: '5px', 
        position: 'relative',
    };

    const timelineItemStyle = {
        alignItems: 'center', 
        marginBottom: '15px', 
    };

    const circleStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#FAD32E',
        color: '#FFFFFF',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '30px',
        marginRight: '20px', 
        position: 'relative',
        zIndex: 1, 
    };

    const stepTextStyle = {
        textAlign: 'left', 
        fontWeight: '600',
    };

    const cellStyle = {
        height: '25px',
        textAlign: 'center',
        backgroundColor: '#ebebeb',
    };

    const boldCellStyle = {
        height: '25px',
        fontWeight: '600',
    };


    return (
        <div style={{ padding: '15px' }}>
            <Button
                onClick={handleClickOpen}
                style={{ backgroundColor: '#FAD32E', fontSize: '16px', color: 'white', fontWeight: '900', padding: '10px 13px', borderRadius: '10px', marginLeft: '2px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: 'none', outline: 'none' }}>
                    Import CSV
                    <DescriptionIcon style={{ marginLeft: '10px' }} fontSize="small" />
            </Button>

            {/* Modal */}
            <Modal show={showModal} onClick={handleModalClick} size="lg" backdrop='static'>
                <Modal.Header>
                    <Button variant="link" onClick={handleClose} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                        ×
                    </Button>
                    <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>BATCH IMPORT STUDENTS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Timeline or instructions */}
                    <div style={timelineStyle}>
                        {/* Group 1: Download */}
                        <div style={timelineItemStyle}>
                            {/* Text in a single row */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={circleStyle}>1</div>
                                <div style={stepTextStyle}>Download CSV file</div>
                            </div>
                            {/* Buttons in the next row */}
                            <div style={{ marginLeft: '80px', display: 'flex', gap: '10px' }}>
                                <button 
                                    style={{ ...whiteButtonStyle, display: 'flex', alignItems: 'center' }}
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = '/files/departmental_infotemplate.csv'; 
                                        link.download = 'departmental_infotemplate.csv';   
                                        link.click();  
                                    }}>
                                    <BiSolidDownload style={{ marginRight: '8px', fontSize: '15px' }} />
                                    DOWNLOAD USER INFO IN CSV FILE
                                </button>
                                <button 
                                    style={{ ...whiteButtonStyle, display: 'flex', alignItems: 'center' }}
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = '/files/departmental_blanktemplate.csv'; 
                                        link.download = 'departmental_blanktemplate.csv';   
                                        link.click();  
                                    }}>
                                    <BiSolidDownload style={{ marginRight: '8px', fontSize: '15px' }} />
                                    DOWNLOAD BLANK CSV TEMPLATE
                                </button>
                            </div>
                        </div>

                        {/* Group 2: Add or Edit */}
                        <div style={timelineItemStyle}>
                            {/* Text in a single row */}
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                <div style={circleStyle}>2</div>
                                <div style={stepTextStyle}>Add or edit information in CSV template</div>
                            </div>
                            {/* Additional instructions */}
                            <div style={{ fontSize: '14px', marginLeft: '80px', marginTop: '0px' }}>Required fields are student id number, full name, email, password, and program.</div>
                            {/* Students table guide */}
                            <Table style={{ width: '85%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '20px' }}>
                                <tbody>
                                    <tr>
                                        <td style={cellStyle}>A</td>
                                        <td style={cellStyle}>B</td>
                                        <td style={cellStyle}>C</td>
                                        <td style={cellStyle}>D</td>
                                        <td style={cellStyle}>E</td>
                                        <td style={cellStyle}>F</td>
                                    </tr>
                                    <tr>
                                        <td style={boldCellStyle}>ID Number</td>
                                        <td style={boldCellStyle}>First Name</td>
                                        <td style={boldCellStyle}>Last Name</td>
                                        <td style={boldCellStyle}>Email</td>
                                        <td style={boldCellStyle}>Password</td>
                                        <td style={boldCellStyle}>Program</td> 
                                    </tr>
                                    <tr>
                                        <td style={{ height: '25px' }}>00-00000</td>
                                        <td style={{ height: '25px' }}>Juan</td>
                                        <td style={{ height: '25px' }}>Dela Cruz</td>
                                        <td style={{ height: '25px' }}>jdelacruz@gbox.ncf.edu.ph</td>
                                        <td style={{ height: '25px' }}>jdelacruz</td>
                                        <td style={{ height: '25px' }}>BSIS</td> 
                                    </tr>
                                </tbody>
                            </Table>
                        </div>

                        {/* Group 3: Upload */}
                        <div style={timelineItemStyle}>
                            {/* Text in a single row */}
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0px', marginBottom: '0px' }}>
                                <div style={circleStyle}>3</div>
                                <div style={stepTextStyle}>Upload CSV file</div>
                            </div>
                        </div>
                        {/* File input */}
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleFileChange}
                                style={{ flex: '0 0 80%', padding: '6px 10px', fontSize: '14px', border: '2px solid #FAD32E', borderRadius: '2px', backgroundColor: '#f9f9f9', color: '#333', cursor: 'pointer', transition: 'all 0.3s ease', marginLeft: '85px', marginRight: '5px' }}
                                    onMouseOver={(e) => e.target.style.borderColor = '#FAD32E'}
                                    onMouseOut={(e) => e.target.style.borderColor = '#EFEFEF'}
                            />
                            {/* Loading spinner */}
                            {loading && (
                                <div style={{ flex: '0 0 20%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '0', marginLeft: '10px' }}>
                                    <div style={{ width: '20px', height: '20px', border: '4px solid #f3f3f3', borderTop: '4px solid #FAD32E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                </div>)}
                            </div>
                        </div>
                        {/* Add CSS for the spinner animation */}
                        <style>
                            {`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}
                        </style>
                </Modal.Body>
                {/* Buttons */}
                <div className="d-flex justify-content-end mt-3">
                    <button type="button" onClick={handleClose} style={cancelButtonStyle}>
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit} style={buttonStyle}>
                        Import
                    </button>
                </div>
            </Modal>
        </div>
    );
};


export default ImportDepartmentalCSV;
