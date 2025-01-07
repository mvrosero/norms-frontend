import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';

import SearchAndFilter from '../general/SearchAndFilter'; 
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
    const [activeAnnouncement, setActiveAnnouncement] = useState(null);
    const [hoveredAnnouncement, setHoveredAnnouncement] = useState(null);
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


    // Set the proper format for date and time
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


    // Set the styles for the status
    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'published') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'unpublished') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else if (status === 'draft') {
            backgroundColor = '#FFF5DC';
            textColor = '#FFC107';
        } else {
            backgroundColor = '#E8EBF6';
            textColor = '#4169E1'; 
        }     
        return (
            <div style={{
                backgroundColor,
                color: textColor,
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: '30px',
                padding: '4px 17px',
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: '20px',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: textColor,
                    marginRight: '7px',
                }} />
                {status}
            </div>
        );
    };


return (
    <div>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Announcements</h6>
            </div>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', marginLeft: '90px', padding: '0 20px' }}>
                <SearchAndFilter />
            </div>
            
            {/* Pinned Announcements Section */}
            <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Pinned Announcements</text>
                <Row xs={1} md={1} lg={1} className="g-4" style={{ marginTop: '2px', marginBottom: '40px', marginLeft: '100px', marginRight: '20px' }}>
                    {announcements.filter(a => a.status === 'pinned').map(a => (
                        <Col key={a.announcement_id}>
                            <Card style={{ backgroundColor: (activeAnnouncement === a.announcement_id || hoveredAnnouncement === a.announcement_id) ? '#ebebeb' : '', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                                onMouseOut={() => setActiveAnnouncement(null)} onClick={() => handleViewAnnouncement(a)}
                                onMouseEnter={() => setHoveredAnnouncement(a.announcement_id)}
                                onMouseLeave={() => setHoveredAnnouncement(null)}
                            >
                                <Card.Body style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {/* Image on the left */}
                                    {a.filenames && (
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:9000/uploads/${a.filenames.split(',')[0]}`}
                                            alt="Announcement Image"
                                            style={{ maxHeight: '250px', maxWidth: '250px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '50px' }}
                                        />
                                    )}
                                    {/* Text content on the right */}
                                    <div style={{ flex: 1 }}>
                                        <Card.Title style={{ marginTop: '20px', marginBottom: '20px', fontSize: '28px' }}>{a.title}</Card.Title>
                                        <Card.Text style={{ marginRight: '30px', fontSize: '16px' }}>
                                            {truncateText(a.content, 700)}{' '}
                                            {a.content.length > 700 && (
                                                <span
                                                    onClick={() => handleViewAnnouncement(a)}
                                                    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    See more...
                                                </span>
                                            )}
                                        </Card.Text>
                                        <Card.Text className="text-muted" style={{ marginTop: '20px', marginBottom: '20px', fontSize: '15px' }}>
                                            {renderStatus(a.status)} {renderDateTime(a.created_at, a.updated_at)}
                                        </Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
          
        







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
                onHide={handleCloseViewModal} 
                announcement={selectedAnnouncement}
            />
            )}
        </div>
    );
}
