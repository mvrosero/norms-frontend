import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';
import { FaRegClock } from 'react-icons/fa';
import { MdFilePresent } from "react-icons/md";
 
import StudentInfo from './StudentInfo';
import StudentNavigation from './StudentNavigation';
import SearchAndFilter from '../general/SearchAndFilter';
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
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchKeyword, setSearchKeyword] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        } else {
            axios.get('https://test-backend-api-2.onrender.com/announcements', {
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


    // Handle the sort announcement
    const sortAnnouncements = (announcements) => {
        return announcements.sort((a, b) => {
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);

            if (sortOrder === 'asc') {
                return dateA - dateB; 
            } else {
                return dateB - dateA; 
            }
        });
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
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', marginLeft: '70px', padding: '0 20px' }}>
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
                                        {a.filenames && (() => {
                                                const firstFile = a.filenames.split(',')[0];
                                                const fileExtension = firstFile.split('.').pop().toLowerCase();
                                                const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

                                                return isImage ? (
                                                    <Card.Img
                                                        variant="top"
                                                        src={`https://test-backend-api-2.onrender.com/uploads/${firstFile}`}
                                                        alt="Announcement Image"
                                                        style={{ maxHeight: '250px', maxWidth: '250px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '50px' }}
                                                    />
                                                ) :  (
                                                    <Card style={{ maxHeight: '450px', maxWidth: '450px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '50px', border: '1px solid #0D4809' }}>
                                                        <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                            <MdFilePresent style={{ fontSize: '220px', color: '#0D4809' }} />
                                                        </Card.Body>
                                                    </Card>
                                                );
                                        })()}
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
            </Row>

            {/* Announcement Containers Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '120px', marginRight: '20px' }}>
                <text style={{ fontSize: '20px', fontWeight: '600' }}>Other Announcements</text>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} style={{ marginRight: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaRegClock style={{ fontSize: '25px', color: sortOrder === 'asc' ? '#8C8C8C' : '#134E0F' }}/>
                </button>
            </div>
            <Row xs={1} md={1} lg={1} className="g-4" style={{ marginTop: '2px', marginBottom: '40px', marginLeft: '100px', marginRight: '20px' }}>
                {sortAnnouncements(announcements.filter(a => a.status === 'published')).map(a => (
                    <Col key={a.announcement_id}>
                        <Card
                            style={{ backgroundColor: (activeAnnouncement === a.announcement_id || hoveredAnnouncement === a.announcement_id) ? '#ebebeb' : '', cursor: 'pointer',transition: 'background-color 0.3s ease' }}
                                onMouseOut={() => setActiveAnnouncement(null)} onClick={() => handleViewAnnouncement(a)}
                                onMouseEnter={() => setHoveredAnnouncement(a.announcement_id)} 
                                onMouseLeave={() => setHoveredAnnouncement(null)} 
                            >
                            <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <Card.Title style={{ marginTop: '7px', marginLeft: '10px', fontSize: '20px' }}>{a.title}</Card.Title>
                                    <Card.Text style={{ marginLeft: '10px', marginRight: '50px', fontSize: '14px' }}> {truncateText(a.content, 250)}{' '} {a.content.length > 250 && (
                                        <span onClick={() => handleViewAnnouncement(a)} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}> See more... </span>)}
                                    </Card.Text>
                                    <Card.Text className="text-muted" style={{ marginTop: '10px', marginLeft: '10px', fontSize: '13px' }}> {renderStatus(a.status)} {renderDateTime(a.created_at, a.updated_at)} </Card.Text>
                                </div>
                                    {a.filenames && (() => {
                                            const firstFile = a.filenames.split(',')[0];
                                            const fileExtension = firstFile.split('.').pop().toLowerCase();
                                            const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

                                            return isImage ? (
                                                <Card.Img
                                                    variant="top"
                                                    src={`https://test-backend-api-2.onrender.com/uploads/${firstFile}`}
                                                    alt="Announcement Image"
                                                    style={{ maxHeight: '100px', maxWidth: '100px' }}
                                                />
                                            ) : null;
                                        })()}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
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
