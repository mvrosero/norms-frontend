import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

import { MdClose, MdFilePresent } from 'react-icons/md';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus, FaRegClock, FaThumbtack, FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { RiUnpinFill } from "react-icons/ri";
import { IoMdAttach } from "react-icons/io";

import '../../styles/style.css';
import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforManagementTable from '../../elements/general/searchandfilters/SFforManagementTable';
import ViewAnnouncementModal from '../../elements/osa coordinator/modals/ViewAnnouncementModal';

export default function CoordinatorAnnouncements() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementFormData, setAnnouncementFormData] = useState({
        title: '',
        content: '',
        status: ''
    });
    const [files, setFiles] = useState([]);
    const [originalFiles, setOriginalFiles] = useState([]); 
    const [editing, setEditing] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [activeAnnouncement, setActiveAnnouncement] = useState(null);
    const [hoveredAnnouncement, setHoveredAnnouncement] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [focusedElement, setFocusedElement] = useState(null); 
    const [sortOrder, setSortOrder] = useState('asc');
    const [allItems, setAllItems] = useState([]);  
    const [searchQuery, setSearchQuery] = useState('');


    // Maximum text area length 
    const maxLength = 1000;
    const currentLength = announcementFormData.content.length;


    // Handle the focus state for both text area and select
    const handleFocus = (element) => {
        setFocusedElement(element); 
    };

    const handleBlur = () => {
        setFocusedElement(null); 
    };



    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/announcements', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setAnnouncements(response.data);
            setAllItems(response.data);  
            setFilteredAnnouncements(response.data); 
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Apply search query to announcements
    useEffect(() => {
        const filtered = allItems.filter(announcement => {
            const normalizedQuery = searchQuery.toLowerCase();
            const matchesQuery = 
                announcement.title.toLowerCase().includes(normalizedQuery) ||
                announcement.content.toLowerCase().includes(normalizedQuery);  

            return matchesQuery;
        });
        setFilteredAnnouncements(filtered);
    }, [searchQuery, allItems]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);



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
        setAnnouncementFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };    

    const handleFileChange = (e) => {
        setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    };

    // Handle the submit announcement
    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        const url = editing ? `https://test-backend-api-2.onrender.com/announcement/${editing}` : 'https://test-backend-api-2.onrender.com/create-announcement';
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
                status: ''
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


    // Handle the cancellation of submit announcement 
    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: 'Any unsaved changes will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, close it',
            cancelButtonText: 'No, keep changes',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsFocused(false);
                setFocusedElement(null);
                handleCloseAnnouncementModal(); 
            }
        });
    };


    // Handle the pin announcement 
    const handlePinAnnouncement = async (announcement_id) => {
        try {
            const response = await fetch(`https://test-backend-api-2.onrender.com/announcement/${announcement_id}/pin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `Failed with status: ${response.status}`;
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
    
            Swal.fire({
                title: 'Pinned!',
                text: data.message,
                icon: 'success',
                timer: 2000,  
                showConfirmButton: false,  
            }).then(() => {
                window.location.reload(); 
            });
            
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `There was an issue pinning the announcement: ${error.message}`,
                icon: 'error',
            });
    
            console.error('Error pinning announcement:', error); 
        }
    };


    // Handle the unpin announcement
    const handleUnpinAnnouncement = async (announcement_id) => {
        try {
            const response = await fetch(`https://test-backend-api-2.onrender.com/announcement/${announcement_id}/unpin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `Failed with status: ${response.status}`;
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
    
            Swal.fire({
                title: 'Unpinned!',
                text: data.message,
                icon: 'success',
                timer: 2000,  
                showConfirmButton: false,  
            }).then(() => {
                window.location.reload(); 
            });
            
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `There was an issue unpinning the announcement: ${error.message}`,
                icon: 'error',
            });
    
            console.error('Error unpinning announcement:', error); 
        }
    };    
    

    // Handle the edit announcement
    const handleEditAnnouncement = (id) => {
        const announcement = announcements.find(ann => ann.announcement_id === id);
        if (announcement) {
            setAnnouncementFormData({
                title: announcement.title,
                content: announcement.content,
                status: announcement.status
            });
            setOriginalFiles(announcement.filenames.split(',').map(filename => ({ name: filename }))); 
            setFiles([]);
            setEditing(id);
            setShowAnnouncementModal(true);
        }
    };


    // Handle the delete announcement
    const handleDeleteAnnouncement = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this announcement?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://test-backend-api-2.onrender.com/announcement/${id}`, {
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
    


    const handleViewAnnouncement = (announcement) => {
        setSelectedAnnouncement(announcement);
        setActiveAnnouncement(announcement.announcement_id); 
        setShowViewModal(true);
    };
    
    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedAnnouncement(null);
    };


    // Handle file attachment
    const renderFileTiles = (filesList, isOriginal = false) => (
        filesList.map((file, index) => (
            <Card
                key={isOriginal ? `original-${index}` : index}
                style={{ width: '120px', height: '120px', position: 'relative', margin: '10px', display: 'inline-block' }}
            >
                <Card.Body style={{ padding: 0 }}>
                    {file.name.match(/\.(jpg|jpeg|png|gif)$/) ? (
                        <img
                            src={isOriginal ? `https://test-backend-api-2.onrender.com/announcement/${file.id}` : URL.createObjectURL(file)} // Use the correct file_id for Google Drive
                            alt={file.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'path/to/default-image.jpg'; // Fallback image if the file doesn't load
                            }}
                        />
                    ) : (
                        <MdFilePresent style={{ fontSize: '100px', color: '#0D4809', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} />
                    )}
                    <p style={{ textAlign: 'center', marginTop: '5px', fontSize: '10px', wordWrap: 'break-word' }}>{file.name.trim()}</p>
                    <MdClose 
                        onClick={() => handleRemoveFile(file, isOriginal)} 
                        style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', color: '#888' }} 
                    />
                </Card.Body>
            </Card>
        ))
    );
    

    // Handle file removal
    const handleRemoveFile = (file, isOriginal = false) => {
        const filename = file.name;  // The filename is the same for both cases
        
        // Check if the file is original or a new file (not original)
        if (isOriginal) {
            // Delete the file for the original files
            axios.delete(`https://test-backend-api-2.onrender.com/announcement/${editing}/file/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            .then(() => {
                // Update the state after successful deletion
                setOriginalFiles(prevFiles => prevFiles.filter(f => f.name !== filename));
                fetchAnnouncements();  // Fetch updated announcements list
            })
            .catch(error => {
                console.error('Error removing file:', error.response?.data?.error || 'An error occurred');
            });
        } else {
            // Remove the file from the state for new (temporary) files
            setFiles(prevFiles => prevFiles.filter(f => f.name !== filename));
        }
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


    // Set the styles for the input fields and select fields
    const regularSelectStyles = {
        backgroundColor: '#f2f2f2',
        borderRadius: '4px',
        padding: '6px',
        outline: 'none',
    };


    
return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Announcements</h6>
            </div>


            {/* Search And Filter Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginLeft: '120px' }}>
                <div style={{ flex: '1 1 50%' }}> <SFforManagementTable onSearch={handleSearch}/> </div>
                <Button
                    onClick={handleCreateNewAnnouncement}
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', marginRight: '80px', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    Add Announcement
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
            </div>


            {/* Pinned Announcements Section */}
            <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Pinned Announcements</text>
            <Row xs={1} md={1} lg={1} className="g-4" style={{ marginTop: '2px', marginBottom: '40px', marginLeft: '100px', marginRight: '20px' }}>
                {filteredAnnouncements.filter(a => a.status === 'pinned').map(a => (
                    <Col key={a.announcement_id}>
                        <Card style={{ backgroundColor: (activeAnnouncement === a.announcement_id || hoveredAnnouncement === a.announcement_id) ? '#ebebeb' : '', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                            onMouseOut={() => setActiveAnnouncement(null)}
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
                                                        src={`http://localhost:9000/uploads/${firstFile}`}
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
                                        <div className="quill-content"
                                            dangerouslySetInnerHTML={{
                                            __html: a.content.length > 750 
                                                ? `${truncateText(a.content, 750)}...` 
                                                : a.content,
                                            }}>
                                        </div>
                                        {a.content.length > 750 && (
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
                                        <Dropdown.Item onClick={() => handleUnpinAnnouncement(a.announcement_id)} className="d-flex align-items-center">
                                            <RiUnpinFill style={{ marginLeft: '10px', marginRight: '20px' }} /> Unpin
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '120px', marginRight: '20px' }}>
                <text style={{ fontSize: '20px', fontWeight: '600' }}>Other Announcements</text>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} style={{ marginRight: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaRegClock style={{ fontSize: '25px', color: sortOrder === 'asc' ? '#8C8C8C' : '#134E0F' }}/>
                </button>
            </div>
            <Row xs={1} md={1} lg={1} className="g-4" style={{ marginTop: '2px', marginBottom: '40px', marginLeft: '100px', marginRight: '20px' }}>
                {sortAnnouncements(filteredAnnouncements.filter(a => a.status !== 'pinned')).map(a => (
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
                                    <Card.Text style={{ marginLeft: '10px', marginRight: '50px', fontSize: '14px' }}>   
                                            <div className="quill-content"
                                                dangerouslySetInnerHTML={{
                                                __html: a.content.length > 250 
                                                    ? `${truncateText(a.content, 250)}...` 
                                                    : a.content,
                                                }}>
                                            </div> {a.content.length > 250 && (
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
                                                    src={`http://localhost:9000/uploads/${firstFile}`}
                                                    alt="Announcement Image"
                                                    style={{ maxHeight: '100px', maxWidth: '100px' }}
                                                />
                                            ) : null;
                                     })()}
                                <Dropdown style={{ marginLeft: '10px' }}>
                                    <Dropdown.Toggle variant="link" id={`dropdown-${a.announcement_id}`} style={{ boxShadow: 'none', color: '#FFFFFF', fontSize: '0px', padding: '0' }}>
                                        <BsThreeDotsVertical style={{ boxShadow: 'none', color: '#A2A3A3', fontSize: '20px', padding: '0', marginBottom: '70px', marginRight: '0px' }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handlePinAnnouncement(a.announcement_id)} className="d-flex align-items-center">
                                            <FaThumbtack style={{ marginLeft: '10px', marginRight: '20px' }} /> Pin
                                        </Dropdown.Item>
                                        <hr /> 
                                        <Dropdown.Item onClick={() => handleViewAnnouncement(a)} className="d-flex align-items-center">
                                            <FaEye style={{  marginLeft: '10px', marginRight: '20px' }} /> View
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


           {/* Add and Edit Announcement Modal */}
           <Modal show={showAnnouncementModal} onHide={handleCancel} size="lg" backdrop="static">
           <Modal.Header>
                <Button variant="link" onClick={handleCancel} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px',marginBottom: '10px', marginLeft: editing ? '130px' : '90px', marginRight: editing ? '130px' : '90px' }}> {editing ? 'EDIT ANNOUNCEMENT' : 'CREATE ANNOUNCEMENT'} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAnnouncementSubmit}>
                    <Row className="gy-4">
                        <Form.Group className="title mb-3">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={announcementFormData.title}
                                onChange={handleChange}
                                required
                                onFocus={() => setFocusedElement('title')}
                                onBlur={() => setFocusedElement(null)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#f2f2f2',
                                    border: `1px solid ${focusedElement === 'title' ? (editing ? '#3B71CA' : '#FAD32E') : '#ced4da'}`,
                                    borderRadius: '4px',
                                    boxShadow: focusedElement === 'title' ? (editing ? '0 0 0 2px rgba(59, 113, 202, 1)' : '0 0 0 2px rgba(250, 211, 46, 1)') : 'none',
                                }}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                    <Form.Group className="content mb-3" style={{ marginBottom: '20px' }}>
                        <Form.Label className="fw-bold">Content</Form.Label>
                        <div style={{ position: 'relative', width: '100%' }}>
                        <ReactQuill
                            theme="snow" 
                            value={announcementFormData.content}
                            onChange={(content) => handleChange({ target: { name: 'content', value: content.trim() } })}
                            onFocus={() => setFocusedElement('content')}
                            onBlur={() => setFocusedElement(null)}
                            formats={[ 'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'ordered' ]}
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ list: 'ordered' }, { list: 'bullet' }]
                                ],
                            }}
                            style={{
                                paddingBottom: '35px',
                                backgroundColor: '#f2f2f2',
                                border: `1px solid ${
                                    focusedElement === 'content' ? (editing ? '#3B71CA' : '#FAD32E') : '#ced4da'
                                }`,
                                borderRadius: '4px',
                                boxShadow:
                                    focusedElement === 'content'
                                        ? editing
                                            ? '0 0 0 2px rgba(59, 113, 202, 1)'
                                            : '0 0 0 2px rgba(250, 211, 46, 1)'
                                        : 'none',
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '12px', color: '#666' }}>
                            {announcementFormData.content.length}/{maxLength}
                        </div>
                        </div>
                    </Form.Group>
                    </Row>

                    <Row className="gy-4">
                    <Form.Group className="status mb-3">
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Select
                                as="select"
                                name="status"
                                value={announcementFormData.status || ''}
                                onChange={handleChange}
                                onFocus={() => setFocusedElement('status')} 
                                onBlur={() => setFocusedElement(null)}
                                style={{
                                    ...regularSelectStyles,
                                    border: `1px solid ${focusedElement === 'status' ? (editing ? '#3B71CA' : '#FAD32E') : '#ced4da'}`,
                                    boxShadow: focusedElement === 'status' ? (editing ? '0 0 0 2px rgba(59, 113, 202, 1)' : '0 0 0 2px rgba(250, 211, 46, 1)') : 'none',
                                }}
                            >
                                <option>Draft</option>
                                <option>Published</option>
                                <option>Unpublished</option>
                                <option>Pinned</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Attachments</Form.Label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }} />
                            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap' }}>
                                {/* Render New Files (Added in this session) */}
                                {renderFileTiles(files)}

                                {/* Render Original Files (Already uploaded files) */}
                                {renderFileTiles(originalFiles, true)}

                                    {/* Add New File Button */}
                                    <Card
                                        style={{ width: '120px', height: '120px', margin: '10px', border: '2px dashed #888', backgroundColor: '#f4f4f4', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', transition: 'all 0.3s ease', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
                                        onClick={() => fileInputRef.current.click()}
                                        onMouseEnter={(e) => e.target.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)'}
                                        onMouseLeave={(e) => e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'}
                                    >
                                        <IoMdAttach style={{ fontSize: '35px', color: '#888' }} />
                                        <span style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>Add File</span>
                                    </Card>
                            </div>
                        </Form.Group>
                        </Row>
                        {/* Buttons */}
                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" onClick={handleCancel} className='custom-cancel-button'>
                                Cancel
                            </button>
                            <button type="submit" className={editing ? 'custom-update-button' : 'custom-create-button'}>
                                {editing ? 'Update' : 'Create'}
                            </button>
                        </div>
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