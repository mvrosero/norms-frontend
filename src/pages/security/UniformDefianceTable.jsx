import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from '@emotion/styled';

const UniformDefianceTable = () => {
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/uniform_defiances');
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
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
                        const fileUrl = `http://localhost:9000/uniform_defiance/${filename}`;
                        
                        console.log(`Rendering file: ${fileUrl}`); // Debugging line

                        if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov') {
                            return (
                                <video key={index} controls src={fileUrl} style={{ maxWidth: '100%', display: 'block', marginBottom: '10px' }} />
                            );
                        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                            return (
                                <img key={index} src={fileUrl} alt={`File Preview ${index}`} style={{ maxWidth: '100%', display: 'block', marginBottom: '10px' }} />
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
                            <td>{record.violation_nature}</td>
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
};

export default UniformDefianceTable;
