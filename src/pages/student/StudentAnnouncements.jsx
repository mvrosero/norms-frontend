import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios or use fetch API
import { Card, Row, Col, Modal } from 'react-bootstrap';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import StudentInfo from './StudentInfo';
import StudentNavigation from './StudentNavigation';

export default function StudentAnnouncements() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        } else {
            // Fetch announcements
            axios.get('http://localhost:9000/announcements', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                // Filter announcements with status "Published"
                const publishedAnnouncements = response.data.filter(announcement => announcement.status === 'Published');
                setAnnouncements(publishedAnnouncements);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
                setLoading(false);
            });
        }
    }, [navigate]);


    // Handle view announcement
    const handleViewAnnouncement = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedAnnouncement(null);
    };

    // Render file tiles with conditional size based on the parameter
    const renderFileTiles = (files, isModal = false) => (
        files.map((file, index) => (
            <Card
                key={index}
                style={{
                    width: isModal ? '75px' : '300px', // Increased size for announcement container
                    height: isModal ? '75px' : '300px', // Increased size for announcement container
                    position: 'relative',
                    margin: '10px',
                    display: 'inline-block',
                    cursor: isModal ? 'pointer' : 'default', // Only clickable in modal view
                }}
                onClick={() => isModal && window.open(`http://localhost:9000/uploads/${file}`, '_blank')}
            >
                <Card.Body style={{ padding: 0 }}>
                    {file.match(/\.(jpg|jpeg|png|gif)$/) ? (
                        <img
                            src={`http://localhost:9000/uploads/${file}`}
                            alt={file}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <FileIcon style={{ fontSize: isModal ? '40px' : '60px', color: '#007bff', display: 'block', margin: 'auto' }} />
                    )}
                </Card.Body>
            </Card>
        ))
    );

    // Render the component with announcements if valid
    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title" style={{ margin: '20px 0' }}>Announcements</h6>
            <Row xs={1} md={2} lg={3} className="g-4" style={{ margin: '20px' }}>
                {announcements.map(a => (
                    <Col key={a.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{a.title}</Card.Title>
                                <Card.Text>
                                    {a.content.length > 100 ? `${a.content.substring(0, 100)}...` : a.content}
                                    {a.content.length > 100 && (
                                        <span
                                            onClick={() => handleViewAnnouncement(a)}
                                            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            See more...
                                        </span>
                                    )}
                                </Card.Text>
                                {/* Display only the first file in the announcement container */}
                                {a.filenames && a.filenames.split(',').length > 0 && renderFileTiles([a.filenames.split(',')[0]])}
                                <Card.Text className="text-muted" style={{ marginTop: '10px' }}>
                                    {a.updated_at ? `${new Date(a.updated_at).toLocaleString()}` : `${new Date(a.created_at).toLocaleString()}`}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* View Announcement Modal */}
            {selectedAnnouncement && (
                <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedAnnouncement.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>{selectedAnnouncement.title}</h5>
                        <p>{selectedAnnouncement.content}</p>
                        <h6>Attachments:</h6>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {renderFileTiles(selectedAnnouncement.filenames.split(','), true)}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}
