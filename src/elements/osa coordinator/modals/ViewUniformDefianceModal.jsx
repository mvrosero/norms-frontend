import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewUniformDefianceModal = ({ show, onHide, record }) => {
    const [fileMetadata, setFileMetadata] = useState([]);
    const [fileLoading, setFileLoading] = useState(true); // Track overall loading state for files
    const [fileErrors, setFileErrors] = useState({});
    const [isFileClicked, setIsFileClicked] = useState(false);
    const [clickedFile, setClickedFile] = useState('');

    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setFileMetadata([]);
            setFileLoading(true); // Reset loading state
            setFileErrors({});
            setIsFileClicked(false);
            setClickedFile('');
        }
    }, [show]);

    // Fetch file metadata when record changes
    useEffect(() => {
        if (record) {
            setFileMetadata([]);
            const { photo_video_filenames } = record;
            const filenames = photo_video_filenames.split(",");

            // Fetch metadata for all files
            const fetchMetadata = async () => {
                const metadataPromises = filenames.map(async (filename) => {
                    const fileId = filename.trim();
                    const fileUrl = `https://test-backend-api-2.onrender.com/uniform_defiance/${fileId}`;

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
                setFileLoading(false); // All files fetched, hide the spinner
            };

            fetchMetadata();
        }
    }, [record]);

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

    // Render the file attachments
    const renderFiles = () => {
        if (fileLoading) {
            // Show the spinner if the files are still loading
            return (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '6px solid #f3f3f3',
                        borderTop: '6px solid #a9a9a9',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            );
        }

        return fileMetadata.map(({ fileId, fileUrl, contentType, error }) => {
            if (error) {
                return (
                    <p key={fileId} style={{ color: "red", marginBottom: "10px" }}>
                        Failed to load file: {fileId}
                    </p>
                );
            }

            const fileExtension = contentType?.split("/")[1]?.toLowerCase();

            if (
                ["mp4", "avi", "mov", "mkv", "hevc"].includes(fileExtension) ||
                contentType === "video/quicktime"
            ) {
                return (
                    <div key={fileId} style={{ marginBottom: "10px" }}>
                        <video
                            controls
                            src={fileUrl}
                            style={{ maxWidth: "100%" }}
                            onLoad={() => handleFileLoad(fileId)} // File loaded
                            onError={() => handleFileError(fileId)} // Handle error
                        />
                    </div>
                );
            } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
                return (
                    <div key={fileId} style={{ marginBottom: "10px" }}>
                        <img
                            src={fileUrl}
                            alt="File Preview"
                            style={{ maxWidth: "100%", cursor: "pointer" }}
                            onLoad={() => handleFileLoad(fileId)} // File loaded
                            onError={() => handleFileError(fileId)} // Handle error
                            onClick={() => handleFileClick(fileId, fileUrl)}
                        />
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
        if (status === 'approved') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'rejected') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else if (status === 'pending') {
            backgroundColor = '#FFF5DC';
            textColor = '#FFC107';
        } else {
            backgroundColor = '#EDEDED';
            textColor = '#6C757D'; 
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
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header>
                    <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                        ×
                    </Button>
                    <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW UNIFORM DEFIANCE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {record && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                            <p style={{ fontWeight: 'bold' }}>Slip ID:</p>
                            <p>{record.slip_id}</p>

                            <p style={{ fontWeight: 'bold' }}>Student ID Number:</p>
                            <p>{record.student_idnumber}</p>

                            <p style={{ fontWeight: 'bold' }}>Nature of Violation:</p>
                            <p>{record.nature_name}</p>

                            <p style={{ fontWeight: 'bold' }}>Files Attached:</p>
                            <div>{renderFiles()}</div>

                            <p style={{ fontWeight: 'bold' }}>Status:</p>
                            <p>{renderStatus(record.status)}</p>

                            <p style={{ fontWeight: 'bold' }}>Date Created:</p>
                            <p>
                                {record.created_at
                                    ? `${new Date(record.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}, ${new Date(record.created_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    })}`
                                    : 'N/A'}
                            </p>

                            <p style={{ fontWeight: 'bold' }}>Submitted By:</p>
                            <p>{record.full_name}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Full File Modal for Enlarged View */}
            <Modal show={isFileClicked} onHide={closeFullFileView} size="lg" backdrop="static" centered>
                <Modal.Header>
                    <Button variant="link" onClick={closeFullFileView} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                        ×
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <img src={clickedFile} alt="Enlarged Preview" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '5px' }} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ViewUniformDefianceModal;
