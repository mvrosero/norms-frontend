import React from 'react';
import { Modal, Card } from 'react-bootstrap';  // Ensure Card is imported
import FileIcon from '@mui/icons-material/InsertDriveFile';

const ViewAnnouncementModal = ({ show, onHide, announcement }) => {
    // Render file tiles with conditional size based on the parameter
    const renderFileTiles = (files, isModal = false) => (
        files.map((file, index) => (
            <div key={index} style={{ position: 'relative', margin: '10px' }}>
                <Card
                    style={{
                        width: isModal ? '75px' : '300px',
                        height: isModal ? '75px' : '300px',
                        cursor: isModal ? 'pointer' : 'default',
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
            </div>
        ))
    );

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{announcement.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>{announcement.title}</h5>
                <p>{announcement.content}</p>
                <h6>Attachments:</h6>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {renderFileTiles(announcement.filenames.split(','), true)}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ViewAnnouncementModal;
