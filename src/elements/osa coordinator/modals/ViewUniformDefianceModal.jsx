import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const ViewUniformDefianceModal = ({ show, onHide, record }) => {
    const [isFileClicked, setIsFileClicked] = useState(false);
    const [clickedFile, setClickedFile] = useState('');
    const [fileErrors, setFileErrors] = useState({}); // Track errors for each file
    const [fileLoading, setFileLoading] = useState({}); // Track loading state for each file

    const handleFileClick = (fileUrl) => {
        setClickedFile(fileUrl);
        setIsFileClicked(true);
    };

    const closeFullFileView = () => {
        setIsFileClicked(false);
        setClickedFile('');
    };

    const handleFileLoad = (fileId) => {
        setFileLoading((prev) => ({ ...prev, [fileId]: false })); // Reset loading state
        setFileErrors((prev) => ({ ...prev, [fileId]: false })); // Reset error on file load
    };

    const handleFileError = (fileId) => {
        setFileErrors((prev) => ({ ...prev, [fileId]: true }));
        setFileLoading((prev) => ({ ...prev, [fileId]: false })); // Stop loading on error
        console.error(`Failed to load file: ${fileId}`);
    };

    const renderFile = () => {
        if (record) {
            const { photo_video_filenames } = record;
            const filenames = photo_video_filenames.split(',');

            return filenames.map((filename, index) => {
                const fileId = filename.trim();
                const fileUrl = `https://test-backend-api-2.onrender.com/uniform_defiance/${fileId}`;
                const fileExtension = fileId.split('.').pop().toLowerCase();

                const renderFileError = (fileId) => {
                    return fileErrors[fileId] ? (
                        <p style={{ color: 'red' }}>Failed to load {fileId}.</p>
                    ) : null;
                };

                if (['mp4', 'avi', 'mov', 'mkv'].includes(fileExtension)) {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {fileLoading[fileId] ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <video
                                    controls
                                    src={fileUrl}
                                    style={{ maxWidth: '100%' }}
                                    onLoad={() => handleFileLoad(fileId)}
                                    onError={() => handleFileError(fileId)}
                                />
                            )}
                            {renderFileError(fileId)}
                        </div>
                    );
                } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {fileLoading[fileId] ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <img
                                    src={fileUrl}
                                    alt="File Preview"
                                    style={{ maxWidth: '100%', cursor: 'pointer' }}
                                    onLoad={() => handleFileLoad(fileId)}
                                    onError={() => handleFileError(fileId)}
                                />
                            )}
                            {renderFileError(fileId)}
                        </div>
                    );
                } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'underline', color: 'blue' }}
                            >
                                {filename}
                            </a>
                        </div>
                    );
                } else {
                    return (
                        <p key={index} style={{ color: 'red', marginBottom: '10px' }}>
                            Unsupported file format: {filename}
                        </p>
                    );
                }
            });
        }
        return null;
    };

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
                            <p style={{ fontWeight: 'bold' }}>Student ID Number:</p>
                            <p>{record.student_idnumber}</p>

                            <p style={{ fontWeight: 'bold' }}>Nature of Violation:</p>
                            <p>{record.nature_name}</p>

                            <p style={{ fontWeight: 'bold' }}>Files Attached:</p>
                            <div>{renderFile()}</div>

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
                    {fileLoading[clickedFile] ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <img src={clickedFile} alt="Enlarged Preview" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '5px' }} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ViewUniformDefianceModal;
