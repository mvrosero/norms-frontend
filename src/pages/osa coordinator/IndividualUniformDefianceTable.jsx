import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Fuse from 'fuse.js'; // Import fuse.js

const IndividualUniformDefiance = () => {
    const [defiances, setDefiances] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [selectedFile, setSelectedFile] = useState(''); // State to manage selected file
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchDefiances = useCallback(async () => {
        try {
            const student_idnumber = location.pathname.split('/').pop();
            const response = await axios.get(`http://localhost:9000/uniform_defiances/${student_idnumber}`, { headers });
            
            if (searchQuery) {
                const fuse = new Fuse(response.data, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'photo_video_filename', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4, // Adjust threshold as needed
                });

                const searchResults = fuse.search(searchQuery);
                const filteredDefiances = searchResults
                    .map(result => result.item)
                    .filter(defiance => defiance.status !== 'Pending');

                setDefiances(filteredDefiances);
            } else {
                const nonPendingDefiances = response.data.filter(defiance => defiance.status !== 'Pending');
                setDefiances(nonPendingDefiances);
            }
        } catch (error) {
            console.error('Error fetching defiances:', error);
        }
    }, [headers, searchQuery, location.pathname]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

    const handleShowModal = (file) => {
        setSelectedFile(file);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedFile('');
        setShowModal(false);
    };

    const handleStudentRedirect = (student_idnumber) => {
        navigate(`/individualstudentrecord/${student_idnumber}`);
    };

    return (
        <>
            <div className='container'>
                <div className='col-12'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        style={{
                            padding: '8px',
                            margin: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                {/* Defiance table */}
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}> {/* Setting header background color */}
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Nature of Violation</th>
                            <th>Created At</th>
                            <th>Submitted By</th>
                            <th>File Attached</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleStudentRedirect(defiance.student_idnumber);
                                        }}
                                        style={{ textAlign: 'center', textDecoration: 'underline' }}
                                    >
                                        {defiance.student_idnumber}
                                    </a>
                                </td>
                                <td>{defiance.violation_nature}</td>
                                <td>{defiance.created_at}</td>
                                <td>{defiance.submitted_by}</td>
                                <td>
                                    {defiance.photo_video_filename ? (
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleShowModal(defiance.photo_video_filename);
                                            }}
                                            style={{ textAlign: 'center', textDecoration: 'underline' }}
                                        >
                                            View
                                        </a>
                                    ) : 'No file available'}
                                </td>
                                <td>{defiance.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal to display file */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>File Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFile ? (
                        <div>
                            {selectedFile.endsWith('.jpg') || selectedFile.endsWith('.jpeg') || selectedFile.endsWith('.png') ? (
                                <img src={selectedFile} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                            ) : (
                                <a href={selectedFile} target="_blank" rel="noopener noreferrer">View File</a>
                            )}
                        </div>
                    ) : 'No file available'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IndividualUniformDefiance;
