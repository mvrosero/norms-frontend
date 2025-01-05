import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import FileIcon from '@mui/icons-material/InsertDriveFile';

const ViewAnnouncementModal = ({ show, onHide, selectedAnnouncement }) => {
    const renderFile = () => {
        if (selectedAnnouncement) {
            const filenames = selectedAnnouncement.filenames.split(',');

            return filenames.map((filename, index) => {
                const fileExtension = filename.split('.').pop().toLowerCase();
                const fileUrl = `http://localhost:9000/uploads/${filename.trim()}`;

                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <img src={fileUrl} alt="File Preview" style={{ maxWidth: '100%' }} />
                            </a>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                            <Card style={{ width: '150px', height: '150px', border: '1px solid #ddd' }}>
                                <Card.Body style={{ padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FileIcon style={{ fontSize: '100px', color: '#007bff' }} />
                                </Card.Body>
                            </Card>
                        </div>
                    );
                }
            });
        }
        return null;
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
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header>
                <Button
                    variant="link"
                    onClick={onHide}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '20px',
                        textDecoration: 'none',
                        fontSize: '30px',
                        color: '#a9a9a9',
                    }}
                >
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', marginLeft: '120px', marginRight: '120px' }}>VIEW ANNOUNCEMENT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedAnnouncement ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                        <p style={{ fontWeight: 'bold' }}>Title:</p>
                        <p>{selectedAnnouncement.title}</p>

                        <p style={{ fontWeight: 'bold' }}>Content:</p>
                        <p>{selectedAnnouncement.content}</p>

                        <p style={{ fontWeight: 'bold' }}>Attachments:</p>
                        <div>{renderFile()}</div>

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
    );
};

export default ViewAnnouncementModal;
