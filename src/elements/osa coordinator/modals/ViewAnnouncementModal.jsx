import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { MdFilePresent } from "react-icons/md";
import 'react-quill/dist/quill.snow.css';
import '../../../styles/index.css';

const ViewAnnouncementModal = ({ show, onHide, selectedAnnouncement }) => {
    const [fileMetadata, setFileMetadata] = useState([]);
    const [fileLoading, setFileLoading] = useState(true); 
    const [fileErrors, setFileErrors] = useState({});
    const [isFileClicked, setIsFileClicked] = useState(false);
    const [clickedFile, setClickedFile] = useState('');
    const [isImageClicked, setIsImageClicked] = useState(false);  
    const [clickedImage, setClickedImage] = useState('');  

    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setFileMetadata([]);
            setFileLoading(true); 
            setFileErrors({});
            setIsFileClicked(false);
            setClickedFile('');
            setIsImageClicked(false);  
            setClickedImage('');  
        }
    }, [show]);


    // Fetch file metadata when record changes
    useEffect(() => {
        if (selectedAnnouncement) {
            setFileMetadata([]);
            const { filenames } = selectedAnnouncement; 
            const filenamesArray = filenames.split(",");  

            // Fetch metadata for all files
            const fetchMetadata = async () => {
                const metadataPromises = filenamesArray.map(async (filename) => {
                    const fileId = filename.trim();
                    const fileUrl = `https://test-backend-api-2.onrender.com/announcement/${fileId}`;

                    // Set the file as loading before fetching it
                    try {
                        const response = await fetch(fileUrl);
                        const contentType = response.headers.get("Content-Type");
                        return {
                            fileId,
                            fileUrl,
                            contentType,
                        };
                    } catch (error) {
                        console.error(`Failed to fetch metadata for file: ${fileId}`, error);
                        return { fileId, fileUrl, error: true };
                    }
                });

                const metadata = await Promise.all(metadataPromises);
                setFileMetadata(metadata);
                setFileLoading(false); 
            };

            fetchMetadata();
        }
    }, [selectedAnnouncement]);


    // Handles zoom in of selected file
    const handleFileClick = (fileId, fileUrl) => {
        setClickedFile(fileUrl);
        setIsFileClicked(true);
    };

    const closeFullFileView = () => {
        setIsFileClicked(false);
        setClickedFile('');
    };

    const handleFileLoad = (fileId) => {
        setFileErrors((prev) => ({ ...prev, [fileId]: false }));
    };

    const handleFileError = (fileId) => {
        setFileErrors((prev) => ({ ...prev, [fileId]: true }));
    };

    const renderFiles = () => {
        if (fileLoading) {
            // Show the spinner if the files are still loading
            return (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <div style={{ width: '50px', height: '50px', border: '6px solid #f3f3f3', borderTop: '6px solid #a9a9a9', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        return fileMetadata.map(({ fileId, fileUrl, contentType, error }, index) => {
            if (error) {
                return (
                    <p key={fileId} style={{ color: "red", marginBottom: "10px" }}>
                        Failed to load file: {fileId}
                    </p>
                );
            }
        
            const fileExtension = contentType?.split("/")[1]?.toLowerCase();  
        
            console.log(`Checking file extension: ${fileExtension}`); 
        
            if (
                ["mp4", "avi", "mov", "mkv", "hevc"].includes(fileExtension) ||
                contentType === "video/quicktime" ||
                contentType === "video/x-matroska" ||
                contentType === "video/mp4" ||
                contentType === "video/x-msvideo" ||  
                contentType === "video/hevc" 
            ) {
                return (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <video
                            controls
                            src={fileUrl}
                            style={{ maxWidth: "100%" }}
                            onLoad={() => handleFileLoad(fileId)} 
                            onError={() => handleFileError(fileId)} 
                        />
                    </div>
                );
            } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
                return (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <img
                            src={fileUrl}
                            alt="File Preview"
                            style={{ maxWidth: "100%", cursor: "pointer" }}
                            onLoad={() => handleFileLoad(fileId)} 
                            onError={() => handleFileError(fileId)} 
                            onClick={() => handleFileClick(fileId, fileUrl)}
                        />
                    </div>
                );
            } else if (["doc", "docx", "pdf"].includes(fileExtension) || 
                contentType === "application/msword" ||
                contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                contentType === "application/pdf"
            ) {
                return (
                    <div key={index} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Card style={{ width: '100px', height: '100px', border: '1px solid #0D4809', marginRight: '10px', marginBottom: '50px' }}>
                                <Card.Body style={{ padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <MdFilePresent style={{ fontSize: '90px', color: '#0D4809' }} />
                                </Card.Body>
                                <p style={{ textAlign: 'center', marginTop: '5px', fontSize: '10px', wordWrap: 'break-word' }}>
                                    {fileId.trim()}
                                </p>
                            </Card>
                        </a>
                    </div>
                );
            } else {
                return (
                    <p key={fileId} style={{ color: "red", marginBottom: "10px" }}>
                        Unsupported file format: {fileId}
                    </p>
                );
            }
        });
    };
        

    // Styles for the status
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
                padding: '5px 20px',
                display: 'inline-flex',
                alignItems: 'center',
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
    <>
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header>
                <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW ANNOUNCEMENT</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    {selectedAnnouncement ? (
                        <div className="quill-content" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                            <p style={{ fontWeight: 'bold' }}>Title:</p>
                            <p style={{ fontWeight: '600', fontSize: '20px' }}>{selectedAnnouncement.title}</p>

                            <p style={{ fontWeight: 'bold' }}>Content:</p>
                            <p className="quill-content"
                                style={{ textAlign: 'justify' }}
                                dangerouslySetInnerHTML={{
                                    __html: selectedAnnouncement.content,
                                }} />

                            <p style={{ fontWeight: 'bold' }}>Attachments:</p>
                            <div>{renderFiles()}</div>

                            <p style={{ fontWeight: 'bold' }}>Status:</p>
                            <p>{renderStatus(selectedAnnouncement.status)}</p>

                            <p style={{ fontWeight: 'bold' }}>Date Created:</p>
                            <p>
                                {selectedAnnouncement.created_at
                                    ? `${new Date(selectedAnnouncement.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}, ${new Date(selectedAnnouncement.created_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    })}`
                                    : 'N/A'}
                            </p>

                            <p style={{ fontWeight: 'bold' }}>Date Updated:</p>
                            <p>
                                {selectedAnnouncement.updated_at
                                    ? `${new Date(selectedAnnouncement.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}, ${new Date(selectedAnnouncement.updated_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    })}`
                                    : 'N/A'}
                            </p>
                        </div>
                    ) : (
                        <p>No announcement selected.</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Full Image Modal for Enlarged View */}
            <Modal show={isImageClicked} onHide={() => setIsImageClicked(false)} size="lg" backdrop="static" centered>
                <Modal.Header>
                    <Button variant="link" onClick={() => setIsImageClicked(false)} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                        ×
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <img src={clickedImage} alt="Enlarged Preview" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '5px' }} />
                </Modal.Body>
            </Modal>
        </>
    );
};


export default ViewAnnouncementModal;
