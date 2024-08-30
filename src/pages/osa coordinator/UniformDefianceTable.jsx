import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Button, Table, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js';

const UniformDefianceTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const navigate = useNavigate();

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
            data = data.filter(defiance => defiance.status === 'Pending');

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

    const renderFile = () => {
        if (selectedRecord) {
            const { photo_video_filenames } = selectedRecord;
            const filenames = photo_video_filenames.split(',');
    
            return filenames.map((filename, index) => {
                const fileExtension = filename.split('.').pop().toLowerCase();
                const fileUrl = `http://localhost:9000/uploads/${filename}`;
        
                if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov') {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <video controls src={fileUrl} style={{ maxWidth: '100%' }} />
                            </a>
                        </div>
                    );
                } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <img src={fileUrl} alt="File Preview" style={{ maxWidth: '100%' }} />
                            </a>
                        </div>
                    );
                } else {
                    return <p key={index}>Unsupported file format</p>; // Handle unsupported formats
                }
            });
        }
        return null;
    };

    return (
        <>
            <div className='container'>
                <br />
                <div className='col-12'>
                </div>

                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Nature of Violation</th>
                            <th>Submitted By</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{defiance.student_idnumber}</td>
                                <td>{defiance.violation_nature}</td>
                                <td>{defiance.submitted_by}</td>
                                <td>
                                    <div 
                                            className="d-flex align-items-center" 
                                            style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }} 
                                            onClick={() => handleShowDetailsModal(defiance)}
                                        >
                                            View
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Button className='btn btn-success btn-md ms-2' onClick={() => updateStatus(defiance.slip_id, 'Approved')} style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>
                                            <CheckIcon />
                                        </Button>
                                        <Button className='btn btn-danger btn-md ms-2' onClick={() => updateStatus(defiance.slip_id, 'Rejected')} style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
                                            <CloseIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal to display record details */}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '60px' }}>UNIFORM DEFIANCE SLIP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && (
                        <div>
                            <p><strong>Slip ID:</strong> {selectedRecord.slip_id}</p>
                            <p><strong>Student ID:</strong> {selectedRecord.student_idnumber}</p>
                            <p><strong>Violation Nature:</strong> {selectedRecord.violation_nature}</p>
                            <p><strong>File Preview:</strong></p>
                            {renderFile()}
                            <p><strong>Status:</strong> {selectedRecord.status}</p>
                            <p><strong>Created At:</strong> {new Date(selectedRecord.created_at).toLocaleString()}</p>
                            <p><strong>Submitted By:</strong> {selectedRecord.submitted_by}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailsModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UniformDefianceTable;
