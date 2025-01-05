import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { MdClose } from 'react-icons/md';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaThumbtack, FaEye, FaPen, FaTrash } from 'react-icons/fa';


import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import ViewAnnouncementModal from '../../elements/osa coordinator/modals/ViewAnnouncementModal';

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
    const [activeAnnouncement, setActiveAnnouncement] = useState(null);
    const [hoveredAnnouncement, setHoveredAnnouncement] = useState(null);



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
        setActiveAnnouncement(announcement.announcement_id); 
        setShowViewModal(true);
    };
    

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedAnnouncement(null);
    };


    const handleRemoveFile = (file, isOriginal = false) => {
        const filename = isOriginal ? file.name : file.name;
    
        // For original files, remove from the backend and update the state
        if (isOriginal) {
            axios.delete(`http://localhost:9000/announcement/${editing}/file/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            .then(() => {
                setOriginalFiles(prevFiles => prevFiles.filter(f => f.name !== filename));
                fetchAnnouncements(); // Optionally refetch to update the list
            })
            .catch(error => {
                console.error('Error removing file:', error.response?.data?.error || 'An error occurred');
            });
        } else {
            // For new files, just update the state
            setFiles(prevFiles => prevFiles.filter(f => f.name !== filename));
        }
    };


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

    
    const renderFileTiles = (filesList, isOriginal = false) => (
        filesList.map((file, index) => (
            <Card
                key={isOriginal ? `original-${index}` : index}
                style={{
                    width: '100px',
                    height: '100px',
                    position: 'relative',
                    margin: '10px',
                    display: 'inline-block',
                }}
            >
                <Card.Body style={{ padding: 0 }}>
                    {file.name.match(/\.(jpg|jpeg|png|gif)$/) ? (
                        <img
                            src={isOriginal ? `http://localhost:9000/uploads/${file.name}` : URL.createObjectURL(file)}
                            alt={file.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <FileIcon style={{ fontSize: '100px', color: '#007bff', display: 'block', margin: 'auto' }} />
                    )}
                        <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.name}
                        </p>
                    <MdClose
                        onClick={() => handleRemoveFile(file, isOriginal)}
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
        ))
    );

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Announcements</h6>
            </div>


            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginLeft: '60px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SearchAndFilter /> </div>
                <Button
                    onClick={handleCreateNewAnnouncement}
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    Add Announcement
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
            </div>




{/* Pinned Announcements Section */}
<text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Pinned Announcement</text>
<Row xs={1} md={1} lg={1} className="g-4" style={{ marginTop: '2px', marginBottom: '40px', marginLeft: '100px', marginRight: '20px' }}>
    {announcements.filter(a => a.status === 'pinned').map(a => (
        <Col key={a.announcement_id}>
            <Card
                style={{
                    backgroundColor: (activeAnnouncement === a.announcement_id || hoveredAnnouncement === a.announcement_id) ? '#ebebeb' : '',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOut={() => setActiveAnnouncement(null)}
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

                    {/* Dropdown menu for actions */}
                    <Dropdown style={{ marginBottom: '180px', marginLeft: '10px' }}>
                        <Dropdown.Toggle variant="link" id={`dropdown-${a.announcement_id}`} style={{ boxShadow: 'none', color: '#FFFFFF', fontSize: '0px', padding: '0' }}>
                            <BsThreeDotsVertical style={{ boxShadow: 'none', color: '#A2A3A3', fontSize: '20px', padding: '0', marginBottom: '70px', marginRight: '0px' }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => (a.announcement_id)} className="d-flex align-items-center">
                                <FaThumbtack style={{ marginLeft: '10px', marginRight: '20px' }} /> Pin
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item onClick={() => handleViewAnnouncement(a)} className="d-flex align-items-center">
                                <FaEye style={{ marginLeft: '10px', marginRight: '20px' }} /> View
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item onClick={() => handleEditAnnouncement(a.announcement_id)} className="d-flex align-items-center">
                                <FaPen style={{ marginLeft: '10px', marginRight: '20px' }} /> Edit
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item onClick={() => handleDeleteAnnouncement(a.announcement_id)} className="d-flex align-items-center">
                                <FaTrash style={{ marginLeft: '10px', marginRight: '20px' }} /> Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Body>
            </Card>
        </Col>
    ))}
</Row>


{/* Announcement Containers Section */}
<text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Other Announcements</text>
<Row xs={1} md={1} lg={1} className="g-4" style={{ marginTop: '2px', marginBottom: '40px', marginLeft: '100px', marginRight: '20px' }}>
    {announcements.filter(a => a.status !== 'pinned').map(a => (
        <Col key={a.announcement_id}>
            <Card
                style={{ backgroundColor: (activeAnnouncement === a.announcement_id || hoveredAnnouncement === a.announcement_id) ? '#ebebeb' : '', cursor: 'pointer',transition: 'background-color 0.3s ease' }}
                    onMouseOut={() => setActiveAnnouncement(null)} 
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
                    {a.filenames && ( <Card.Img variant="top" src={`http://localhost:9000/uploads/${a.filenames.split(',')[0]}`} alt="Announcement Image" style={{ maxHeight: '100px', maxWidth: '100px' }}/>)}

                    <Dropdown style={{ marginLeft: '10px' }}>
                        <Dropdown.Toggle variant="link" id={`dropdown-${a.announcement_id}`} style={{ boxShadow: 'none', color: '#FFFFFF', fontSize: '0px', padding: '0' }}>
                            <BsThreeDotsVertical style={{ boxShadow: 'none', color: '#A2A3A3', fontSize: '20px', padding: '0', marginBottom: '70px', marginRight: '0px' }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => (a.announcement_id)} className="d-flex align-items-center">
                                <FaThumbtack style={{ marginLeft: '10px', marginRight: '20px' }} /> Pin
                            </Dropdown.Item>
                            <hr /> {/* Adds a line separator */}
                            <Dropdown.Item onClick={() => handleViewAnnouncement(a)} className="d-flex align-items-center">
                                <FaEye style={{  marginLeft: '10px', marginRight: '20px' }} /> View
                            </Dropdown.Item>
                            <hr /> {/* Adds a line separator */}
                            <Dropdown.Item onClick={() => handleEditAnnouncement(a.announcement_id)} className="d-flex align-items-center">
                                <FaPen style={{ marginLeft: '10px', marginRight: '20px' }} /> Edit
                            </Dropdown.Item>
                            <hr /> {/* Adds a line separator */}
                            <Dropdown.Item onClick={() => handleDeleteAnnouncement(a.announcement_id)} className="d-flex align-items-center">
                                <FaTrash style={{ marginLeft: '10px', marginRight: '20px' }} /> Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

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
                                {renderFileTiles(files)}

                                {/* Render Original Files (Already uploaded files) */}
                                {renderFileTiles(originalFiles, true)}

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
            <ViewAnnouncementModal
                show={showViewModal} 
               onHide={() => setShowViewModal(false)} 
               onClick={() => setShowViewModal(false)} 
               selectedAnnouncement={selectedAnnouncement}
            />
            )}
            

        </div>
    );
}