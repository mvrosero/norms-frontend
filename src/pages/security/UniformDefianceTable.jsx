import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from '@emotion/styled';

const UniformDefianceTable = () => {
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [natureNames, setNatureNames] = useState({}); // Store nature names
    const [employeeName, setEmployeeName] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/uniform_defiances');
                const fetchedRecords = response.data;
                setRecords(fetchedRecords);

                // Fetch nature names for all records
                const natureIds = [...new Set(fetchedRecords.map(record => record.nature_id))];
                const natureNamePromises = natureIds.map(id => fetchNatureName(id));

                const fetchedNatureNames = await Promise.all(natureNamePromises);
                const natureNamesMap = natureIds.reduce((acc, id, index) => {
                    acc[id] = fetchedNatureNames[index];
                    return acc;
                }, {});

                setNatureNames(natureNamesMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const fetchEmployeeName = async (employeeIdNumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/employees/${employeeIdNumber}`);
            console.log('Employee API Response:', response.data);
            return response.data.name; // Adjust if the response structure differs
        } catch (error) {
            console.error('Error fetching employee data:', error);
            return 'Unknown Employee'; // Fallback name if the request fails
        }
    };

    const fetchNatureName = async (natureIdNumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/violation-nature/${natureIdNumber}`);
            console.log('Nature API Response:', response.data); // Log response to verify structure
            return response.data.nature_name; // Access the nature_name field
        } catch (error) {
            console.error('Error fetching nature data:', error);
            return 'Unknown Nature'; // Fallback name if the request fails
        }
    };

    const handleViewDetails = async (record) => {
        setSelectedRecord(record);
        const name = await fetchEmployeeName(record.submitted_by);
        console.log('Fetched Employee Name:', name); // Log fetched name
        setEmployeeName(name);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    const handleImageError = (e) => {
        e.target.src = '/path/to/default-image.jpg'; // Replace with the path to your fallback image
    };

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

    const renderFile = () => {
        if (selectedRecord) {
            const { photo_video_filenames } = selectedRecord;
            const filenames = photo_video_filenames.split(',');

            return (
                <div>
                    {filenames.map((filename, index) => {
                        const fileExtension = filename.split('.').pop().toLowerCase();
                        const fileUrl = `http://localhost:9000/uploads/${filename}`;

                        if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov') {
                            return (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" key={index}>
                                    <video controls src={fileUrl} style={{ maxWidth: '100%', display: 'block', marginBottom: '10px' }} />
                                </a>
                            );
                        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                            return (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" key={index}>
                                    <img
                                        src={fileUrl}
                                        alt={`File Preview ${index}`}
                                        onError={handleImageError}
                                        style={{ maxWidth: '100%', display: 'block', marginBottom: '10px' }}
                                    />
                                </a>
                            );
                        } else {
                            return <p key={index}>Unsupported file format</p>;
                        }
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Table bordered hover style={{ borderRadius: '20px', marginTop: '30px', marginLeft: '100px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                        <th>ID</th>
                        <th>ID Number</th>
                        <th>Nature of Violation</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{record.slip_id}</td>
                            <td>{record.student_idnumber}</td>
                            <td>{natureNames[record.nature_id] || 'Unknown Nature'}</td> {/* Use fetched nature name */}
                            <td>{record.status}</td>
                            <td>{new Date(record.created_at).toLocaleString()}</td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <ViewButton onClick={() => handleViewDetails(record)}>
                                    View
                                </ViewButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '60px' }}>UNIFORM DEFIANCE SLIP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && (
                        <div>
                            <p><strong>Slip ID:</strong> {selectedRecord.slip_id}</p>
                            <p><strong>Student ID:</strong> {selectedRecord.student_idnumber}</p>
                            <p><strong>Violation Nature:</strong> {natureNames[selectedRecord.nature_id] || 'Unknown Nature'}</p> {/* Display nature name */}
                            <p><strong>File Preview:</strong></p>
                            {renderFile()}
                            <p><strong>Status:</strong> {selectedRecord.status}</p>
                            <p><strong>Created At:</strong> {new Date(selectedRecord.created_at).toLocaleString()}</p>
                            <p><strong>Submitted By:</strong> {employeeName}</p> {/* Display employee name */}
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
};

export default UniformDefianceTable;
