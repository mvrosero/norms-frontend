import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function CoordinatorAnnouncements() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Create a reference for the file input
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementFormData, setAnnouncementFormData] = useState({
        title: '',
        content: '',
        status: 'Draft'
    });
    const [files, setFiles] = useState([]); // Track selected files
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
            setFiles([]); // Clear files
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
                                <div style={{ marginTop: '10px' }}>
                                    <EditIcon onClick={() => handleEditAnnouncement(a.announcement_id)} style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }} />
                                    <DeleteIcon onClick={() => handleDeleteAnnouncement(a.announcement_id)} style={{ cursor: 'pointer', color: '#dc3545' }} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Announcement Modal */}
            <Modal show={showAnnouncementModal} onHide={handleCloseAnnouncementModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Announcement' : 'Add Announcement'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAnnouncementSubmit}>
                        <Form.Group controlId="formAnnouncementTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={announcementFormData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAnnouncementContent" style={{ marginTop: '10px' }}>
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter content"
                                name="content"
                                value={announcementFormData.content}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAnnouncementStatus" style={{ marginTop: '10px' }}>
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={announcementFormData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Unpublished">Unpublished</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formAnnouncementFiles" style={{ marginTop: '10px' }}>
                            <Form.Label>Attachments</Form.Label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                ref={fileInputRef} // Attach reference to the file input
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    marginTop: '10px',
                                }}
                            >
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '5px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Attachment"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                ))}
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        backgroundColor: '#e9ecef',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <FaPlus size={24} color="#007bff" />
                                </div>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                            {editing ? 'Update' : 'Create'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Announcement View Modal */}
            {selectedAnnouncement && (
                <Modal show={showViewModal} onHide={handleCloseViewModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedAnnouncement.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{selectedAnnouncement.content}</p>
                        <p className="text-muted">{renderDateTime(selectedAnnouncement.created_at, selectedAnnouncement.updated_at)}</p>
                        {selectedAnnouncement.filenames && selectedAnnouncement.filenames.split(',').map((filename, index) => (
                            <img
                                key={index}
                                src={`http://localhost:9000/uploads/${filename}`}
                                alt="Attachment"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    marginBottom: '10px',
                                }}
                            />
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseViewModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
