import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js'; // Import fuse.js

const HistoryTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false); // State to track deletion status
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [fileUrl, setFileUrl] = useState(''); // State to manage file URL
    const [fileType, setFileType] = useState(''); // State to manage file type
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchDefiances = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });

                // Create a new instance of Fuse with the defiances data and search options
                const fuse = new Fuse(response.data, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'photo_video_filename', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4, // Adjust threshold as needed
                });

                // Perform fuzzy search
                const searchResults = fuse.search(searchQuery);

                // Extract the item from search results and filter out those with "Pending" status
                const filteredDefiances = searchResults
                    .map(result => result.item)
                    .filter(defiance => defiance.status !== 'Pending');

                setDefiances(filteredDefiances);
            } else {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
                // Filter out those with "Pending" status
                const nonPendingDefiances = response.data.filter(defiance => defiance.status !== 'Pending');
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
            localStorage.setItem('selectedDefiance', JSON.stringify(defiance)); // Store selected defiance data in localStorage
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
                text: "Successfully Deleted"
            });
            setDeletionStatus(prevStatus => !prevStatus); // Toggle deletionStatus to trigger re-fetch
            // Update the defiances state by removing the deleted defiance
            setDefiances(prevDefiances => prevDefiances.filter(defiance => defiance.slip_id !== slipId));
        } catch (error) {
            console.error('Error deleting defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting defiance. Please try again later.',
            });
        }
    };

    const handleShowModal = async (slip_id) => {
        try {
            const response = await axios.get(`http://localhost:9000/uniform_defiance/${slip_id}`, { responseType: 'blob' });
            const contentType = response.headers['content-type'];
            setFileType(contentType);
            const fileUrl = URL.createObjectURL(response.data);
            setFileUrl(fileUrl);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching file:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while fetching the file. Please try again later.',
            });
        }
    };

    const handleCloseModal = () => {
        setFileUrl('');
        setFileType('');
        setShowModal(false);
    };

    const handleStudentRedirect = (student_idnumber) => {
        navigate(`/individualuniformdefiance/${student_idnumber}`);
    };

    const renderFilePreview = () => {
        if (fileType) {
            if (fileType.startsWith('image/')) {
                return <img src={fileUrl} alt="Preview" style={{ width: '100%', height: 'auto' }} />;
            } else if (fileType.startsWith('video/')) {
                return (
                    <video controls style={{ width: '100%' }}>
                        <source src={fileUrl} type={fileType} />
                        Your browser does not support the video tag.
                    </video>
                );
            } else {
                return <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>;
            }
        }
        return 'No file available';
    };

    return (
        <>
            <div className='container'>
                <br />
                <div className='col-12'>
                </div>

                {/* Defiance table */}
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
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
                                                handleShowModal(defiance.slip_id); // Pass slip_id to fetch file
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
                    {renderFilePreview()}
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

export default HistoryTable;
