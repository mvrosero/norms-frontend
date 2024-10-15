import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';
import SearchAndFilter from '../general/SearchAndFilter'; // Import SearchAndFilter component
import StudentInfo from './StudentInfo';
import StudentNavigation from './StudentNavigation';
import ViewAnnouncementModal from '../../elements/student/modals/ViewAnnouncementModal';

export default function StudentAnnouncements() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        } else {
            axios.get('http://localhost:9000/announcements', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setAnnouncements(response.data);
                setFilteredAnnouncements(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
                setLoading(false);
            });
        }
    }, [navigate]);

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        if (keyword.trim() === '') {
            setFilteredAnnouncements(announcements);
        } else {
            const lowerCaseKeyword = keyword.toLowerCase();
            const filtered = announcements.filter(announcement =>
                announcement.title.toLowerCase().includes(lowerCaseKeyword) ||
                announcement.content.toLowerCase().includes(lowerCaseKeyword)
            );
            setFilteredAnnouncements(filtered);
        }
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
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title" style={{ margin: '20px 0' }}>Announcements</h6>
            <SearchAndFilter onSearch={handleSearch} />
            <Row xs={1} md={2} lg={3} className="g-4" style={{ margin: '20px' }}>
                {loading ? (
                    <div>Loading...</div> // Optional loading message
                ) : (
                    filteredAnnouncements.map(a => (
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
                                    {a.filenames && a.filenames.split(',').length > 0 && (
                                        <img
                                            src={`http://localhost:9000/uploads/${a.filenames.split(',')[0]}`}
                                            alt={a.filenames.split(',')[0]}
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        />
                                    )}
                                    <Card.Text className="text-muted" style={{ marginTop: '10px' }}>
                                        {a.updated_at ? `${new Date(a.updated_at).toLocaleString()}` : `${new Date(a.created_at).toLocaleString()}`}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* View Announcement Modal */}
            {selectedAnnouncement && (
                <ViewAnnouncementModal
                    show={showViewModal}
                    onHide={handleCloseViewModal} // Ensure the correct prop name is used
                    announcement={selectedAnnouncement}
                />
            )}
        </div>
    );
}
