import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { MdClose } from 'react-icons/md';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function CoordinatorAnnouncements() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementFormData, setAnnouncementFormData] = useState({
        title: '',
        content: '',
        status: 'Draft'
    });
    const [files, setFiles] = useState([]);
    const [originalFiles, setOriginalFiles] = useState([]); // Track original files
    const [editing, setEditing] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:9000/announcements', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setAnnouncements(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch announcements');
            setLoading(false);
        }
    };

    const handleCreateNewAnnouncement = () => {
        setEditing(null);
        setAnnouncementFormData({
            title: '',
            content: '',
            status: 'Draft'
        });
        setFiles([]);
        setOriginalFiles([]);
        setShowAnnouncementModal(true);
    };

    const handleCloseAnnouncementModal = () => {
        setShowAnnouncementModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnnouncementFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    };

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        const url = editing ? `http://localhost:9000/announcement/${editing}` : 'http://localhost:9000/create-announcement';
        const method = editing ? 'put' : 'post';

        const formData = new FormData();
        formData.append('title', announcementFormData.title);
        formData.append('content', announcementFormData.content);
        formData.append('status', announcementFormData.status);

        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            await axios({
                method,
                url,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: editing ? 'Announcement Updated!' : 'Announcement Created!',
                text: `The announcement has been ${editing ? 'updated' : 'created'} successfully.`
            });
            setShowAnnouncementModal(false);
            setAnnouncementFormData({
                title: '',
                content: '',
                status: 'Draft'
            });
            setFiles([]);
            setEditing(null);
            fetchAnnouncements();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.error || 'An error occurred'
            });
        }
    };

    const handleEditAnnouncement = (id) => {
        const announcement = announcements.find(ann => ann.announcement_id === id);
        if (announcement) {
            setAnnouncementFormData({
                title: announcement.title,
                content: announcement.content,
                status: announcement.status
            });
            setOriginalFiles(announcement.filenames.split(',').map(filename => ({ name: filename }))); // Set original files
            setFiles([]);
            setEditing(id);
            setShowAnnouncementModal(true);
        }
    };

    const handleDeleteAnnouncement = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/announcement/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted!', 'The announcement has been deleted.', 'success');
                    fetchAnnouncements();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.response?.data?.error || 'An error occurred'
                    });
                }
            }
        });
    };

    const handleRemoveFile = async (filename, isOriginal = false) => {
        const announcement_id = editing;
        if (!announcement_id) return;

        try {
            await axios.delete(`http://localhost:9000/announcement/${announcement_id}/file/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            Swal.fire('Deleted!', 'The file has been removed.', 'success');

            if (isOriginal) {
                // If original file, remove from originalFiles
                setOriginalFiles(prevFiles => prevFiles.filter(file => file.name !== filename));
            } else {
                // If new file, remove from files
                setFiles(prevFiles => prevFiles.filter(file => file.name !== filename));
            }

            // Optionally, you might want to refetch the announcement or update the state
            fetchAnnouncements(); 

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.error || 'An error occurred'
            });
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return null; // Return null for image files as they're handled separately
        }
        // Return a generic file icon for non-image files
        return <FileIcon style={{ fontSize: '50px', color: '#007bff' }} />;
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength)}...`;
        }
        return text;
    };

    const handleViewAnnouncement = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowViewModal(true);
    };

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Announcements</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button
                    onClick={handleCreateNewAnnouncement}
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <FaPlus style={{ fontSize: '16px', marginRight: '5px' }} />
                    Create New Announcement
                </button>
            </div>

            {loading && <p>Loading announcements...</p>}
            {error && <p>{error}</p>}

            <Row>
                {announcements.map((a) => (
                    <Col key={a.announcement_id} md={4} style={{ marginBottom: '20px' }}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{truncateText(a.title, 50)}</Card.Title>
                                <Card.Text>{truncateText(a.content, 100)}</Card.Text>
                                <Card.Text style={{ fontSize: '14px' }}>
                                    {a.filenames.split(',').map((file, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                            {getFileIcon(file)}
                                            <a
                                                href={`http://localhost:9000/uploads/${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                {file}
                                            </a>
                                            <MdClose
                                                onClick={() => handleRemoveFile(file, true)}
                                                style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                                            />
                                        </div>
                                    ))}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => handleEditAnnouncement(a.announcement_id)}
                                    style={{ marginRight: '10px' }}
                                >
                                    <EditIcon />
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteAnnouncement(a.announcement_id)}
                                >
                                    <DeleteIcon />
                                </Button>
                                <Button
                                    variant="info"
                                    onClick={() => handleViewAnnouncement(a)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    View
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showAnnouncementModal} onHide={handleCloseAnnouncementModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Announcement' : 'Create New Announcement'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAnnouncementSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={announcementFormData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                rows={3}
                                value={announcementFormData.content}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={announcementFormData.status}
                                onChange={handleChange}
                                required
                            >
                                <option>Draft</option>
                                <option>Published</option>
                                <option>Unpublished</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Attachments</Form.Label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                            <Button
                                onClick={() => fileInputRef.current.click()}
                                variant="secondary"
                            >
                                Choose Files
                            </Button>
                            <div style={{ marginTop: '10px' }}>
                                {files.map((file, index) => (
                                    <Card
                                        key={index}
                                        style={{ display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}
                                    >
                                        <Card.Body>
                                            <div>
                                                {getFileIcon(file.name)}
                                                <span style={{ marginLeft: '10px' }}>{file.name}</span>
                                                <MdClose
                                                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                                    style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                                {originalFiles.map((file, index) => (
                                    <Card
                                        key={index}
                                        style={{ display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}
                                    >
                                        <Card.Body>
                                            <div>
                                                {getFileIcon(file.name)}
                                                <span style={{ marginLeft: '10px' }}>{file.name}</span>
                                                <MdClose
                                                    onClick={() => handleRemoveFile(file.name, true)}
                                                    style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                                <Card
                                    style={{
                                        display: 'inline-block',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                        border: '2px dashed #007bff',
                                        backgroundColor: '#f9f9f9',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                    }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Card.Body>
                                        <FaPlus style={{ fontSize: '40px', color: '#007bff' }} />
                                    </Card.Body>
                                </Card>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editing ? 'Update' : 'Create'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* View Announcement Modal */}
            {selectedAnnouncement && (
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedAnnouncement.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{selectedAnnouncement.content}</p>
                        <div>
                            {selectedAnnouncement.filenames.split(',').map((file, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    {getFileIcon(file)}
                                    <a
                                        href={`http://localhost:9000/uploads/${file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        {file}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}
