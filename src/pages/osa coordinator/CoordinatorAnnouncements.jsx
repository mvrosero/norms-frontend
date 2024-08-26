import React, { useEffect, useState } from 'react';
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
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementFormData, setAnnouncementFormData] = useState({
        title: '',
        content: '',
        status: 'Draft',
        photo_video_filename: ''
    });
    const [editing, setEditing] = useState(null);

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
            status: 'Draft',
            photo_video_filename: ''
        });
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
        setAnnouncementFormData(prevState => ({
            ...prevState,
            photo_video_filename: e.target.files[0] ? e.target.files[0].name : ''
        }));
    };

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        const url = editing ? `http://localhost:9000/announcement/${editing}` : 'http://localhost:9000/create-announcement';
        const method = editing ? 'put' : 'post';
        
        try {
            await axios({ method, url, data: announcementFormData, headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            Swal.fire({
                icon: 'success',
                title: editing ? 'Announcement Updated!' : 'Announcement Created!',
                text: `The announcement has been ${editing ? 'updated' : 'created'} successfully.`
            });
            setShowAnnouncementModal(false);
            setAnnouncementFormData({
                title: '',
                content: '',
                status: 'Draft',
                photo_video_filename: ''
            });
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
                status: announcement.status,
                photo_video_filename: announcement.photo_video_filename || ''
            });
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                                <Card.Text>{a.content}</Card.Text>
                                {a.photo_video_filename && <Card.Img variant="top" src={`http://localhost:9000/uploads/${a.photo_video_filename}`} />}
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
                    <Modal.Title>{editing ? 'Edit Announcement' : 'Create Announcement'}</Modal.Title>
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
                                rows={3}
                                name="content"
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
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editing ? 'Update Announcement' : 'Create Announcement'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
