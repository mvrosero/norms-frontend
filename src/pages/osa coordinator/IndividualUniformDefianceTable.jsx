import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import { FaPlus } from 'react-icons/fa';
import defaultProfile from '../../assets/images/default_profile.jpg'; // Adjust path as necessary

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import AddViolationRecordForm from './AddViolationRecord';

const IndividualUniformDefiance = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [defiances, setDefiances] = useState([]);
    const [fileUrl, setFileUrl] = useState('');
    const [fileType, setFileType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchStudentInfo = useCallback(async (student_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/student/${student_idnumber}`, { headers });
            const studentData = response.data[0];
            if (studentData) {
                const fullName = `${studentData.first_name} ${studentData.last_name}`.trim();
                const photoFilename = studentData.profile_photo_filename;
                const photoUrl = photoFilename
                    ? `http://localhost:9000/uploads/profile_photo/${photoFilename}`
                    : defaultProfile;

                setStudentInfo({
                    ...studentData,
                    fullName,
                    profilePhoto: photoUrl
                });
            }
        } catch (error) {
            console.error('Error fetching student info:', error);
        }
    }, [headers]);

    const fetchDefiances = useCallback(async () => {
        try {
            const student_idnumber = location.pathname.split('/').pop();
            await fetchStudentInfo(student_idnumber);
            const response = await axios.get(`http://localhost:9000/uniform_defiances/${student_idnumber}`, { headers });

            if (searchQuery) {
                const fuse = new Fuse(response.data, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'photo_video_filename', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4,
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
    }, [headers, searchQuery, location.pathname, fetchStudentInfo]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

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
        }
    };

    const handleCloseModal = () => {
        setFileUrl('');
        setFileType('');
        setShowModal(false);
    };

    const handleShowAddViolationModal = () => {
        setShowAddViolationModal(true);
    };

    const handleCloseAddViolationModal = async () => {
        setShowAddViolationModal(false);
        await fetchDefiances();
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
            <CoordinatorNavigation />
            <CoordinatorInfo />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'white', marginTop: '80px', marginBottom: '20px', marginLeft: '100px', marginRight: '50px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '1080px', boxSizing: 'border-box' }}>
                    {studentInfo && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={studentInfo.profilePhoto}
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '5px', margin: '20px', objectFit: 'cover' }}
                                onError={(e) => {
                                    console.error('Error loading image:', e.target.src);
                                    e.target.src = defaultProfile; // Fallback to default image on error
                                }}
                            />
                            <div style={{ marginLeft: '20px', fontSize: '16px' }}>
                                <p><strong>Student ID Number:</strong> {studentInfo.student_idnumber}</p>
                                <p><strong>Name:</strong> {studentInfo.fullName}</p>
                                <p><strong>Email:</strong> {studentInfo.email}</p>
                                <p><strong>Department:</strong> {studentInfo.department_name}</p>
                                <p><strong>Program:</strong> {studentInfo.program_name}</p>
                                <p><strong>Year Level:</strong> {studentInfo.year_level}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <SearchAndFilter setSearchQuery={setSearchQuery} style={{ flex: 1 }} />
                    <Button
                        onClick={handleShowAddViolationModal}
                        title="Add Record"
                        style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginLeft: '10px' }}
                    >
                        Add Violation
                        <FaPlus style={{ marginLeft: '2px' }} />
                    </Button>
                </div>

                <Table bordered hover style={{ borderRadius: '20px', marginTop: '20px' }}>
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
                                <td>{defiance.student_idnumber}</td>
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

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
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

            <Modal show={showAddViolationModal} onHide={handleCloseAddViolationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Violation Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddViolationRecordForm handleCloseModal={handleCloseAddViolationModal} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default IndividualUniformDefiance;
