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

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return date.toLocaleString(undefined, options);
    };

    const renderDateTime = (createdAt, updatedAt) => {
        if (updatedAt) {
            return `Updated on: ${formatDateTime(updatedAt)}`;
        }
        return `Posted on: ${formatDateTime(createdAt)}`;
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleViewAnnouncement = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedAnnouncement(null);
    };

    const handleRemoveFile = async (filename, isOriginal = false) => {
        const announcement_id = editing;
        if (!announcement_id) return;
    
        try {
            await axios.delete(`http://localhost:9000/announcement/${announcement_id}/file/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
    
            // Update state without Swal alert
            if (isOriginal) {
                setOriginalFiles(prevFiles => prevFiles.filter(file => file.name !== filename));
            } else {
                setFiles(prevFiles => prevFiles.filter(file => file.name !== filename));
            }
    
            // Optionally, you might want to refetch the announcement or update the state
            fetchAnnouncements(); 
    
        } catch (error) {
            // Handle errors here, if necessary
            console.error('Error removing file:', error.response?.data?.error || 'An error occurred');
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
                    Add Announcement
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <Row xs={1} md={2} lg={3} className="g-4" style={{ margin: '20px' }}>
                {announcements.map(a => (
                    <Col key={a.announcement_id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{a.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{a.status}</Card.Subtitle>
                                <Card.Text>
                                    {truncateText(a.content, 100)}{' '}
                                    {a.content.length > 100 && (
                                        <span
                                            onClick={() => handleViewAnnouncement(a)}
                                            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            See more...
                                        </span>
                                    )}
                                </Card.Text>
                                {a.filenames && (
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:9000/uploads/${a.filenames.split(',')[0]}`}
                                        alt="Announcement Image"
                                    />
                                )}
                                <Card.Text className="text-muted" style={{ marginTop: '10px' }}>
                                    {renderDateTime(a.created_at, a.updated_at)}
                                </Card.Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleEditAnnouncement(a.announcement_id)}
                                    >
                                        <EditIcon /> Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleDeleteAnnouncement(a.announcement_id)}
                                    >
                                        <DeleteIcon /> Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

           {/* Add and Edit Announcement Modal */}
           <Modal show={showAnnouncementModal} onHide={handleCloseAnnouncementModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Announcement' : 'Add Announcement'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAnnouncementSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={announcementFormData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="content"
                                value={announcementFormData.content}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
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
                        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap' }}>
                            {/* Render New Files (Added in this session) */}
                            {files.map((file, index) => (
                                <Card
                                    key={index}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        position: 'relative',
                                        margin: '10px',
                                        display: 'inline-block',
                                    }}
                                >
                                    <Card.Body style={{ padding: 0 }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <MdClose
                                            onClick={() => handleRemoveFile(file)}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                cursor: 'pointer',
                                                color: 'red',
                                            }}
                                        />
                                    </Card.Body>
                                </Card>
                            ))}
                            {/* Render Original Files (Already uploaded files) */}
                            {originalFiles.map((file, index) => (
                                <Card
                                    key={`original-${index}`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        position: 'relative',
                                        margin: '10px',
                                        display: 'inline-block',
                                    }}
                                >
                                    <Card.Body style={{ padding: 0 }}>
                                        <img
                                            src={`http://localhost:9000/uploads/${file.name}`}
                                            alt={file.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <MdClose
                                            onClick={() => handleRemoveFile(file.name, true)}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                cursor: 'pointer',
                                                color: 'red',
                                            }}
                                        />
                                    </Card.Body>
                                </Card>
                            ))}
                            {/* Add New File Button */}
                            <Card
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    margin: '10px',
                                    border: '2px dashed #007bff',
                                    backgroundColor: '#f9f9f9',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FaPlus style={{ fontSize: '30px', color: '#007bff' }} />
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
                        <h5>{selectedAnnouncement.title}</h5>
                        <p>{selectedAnnouncement.content}</p>
                        <p>Status: {selectedAnnouncement.status}</p>
                        <h6>Attachments:</h6>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {selectedAnnouncement.filenames.split(',').map((filename, index) => (
                                <div
                                    key={index}
                                    style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
                                    onClick={() => window.open(`http://localhost:9000/uploads/${filename}`, '_blank')}
                                >
                                    <Card style={{ width: '100px', height: '100px', border: '1px solid #ddd' }}>
                                        <Card.Body style={{ padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {filename.match(/\.(jpg|jpeg|png|gif)$/) ? (
                                                <img
                                                    src={`http://localhost:9000/uploads/${filename}`}
                                                    alt="attachment"
                                                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                                />
                                            ) : (
                                                <FileIcon style={{ fontSize: '50px', color: '#007bff' }} />
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal>
            )}

        </div>
    );
}