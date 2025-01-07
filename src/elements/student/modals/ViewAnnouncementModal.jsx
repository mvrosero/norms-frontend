import React from 'react';
import { Modal, Card, Button } from 'react-bootstrap';  
import FileIcon from '@mui/icons-material/InsertDriveFile';

const ViewAnnouncementModal = ({ show, onHide, announcement }) => {
    
    const renderFileTiles = (files) => {
        return files.map((file, index) => {
            const fileExtension = file.split('.').pop().toLowerCase();
            const fileUrl = `http://localhost:9000/uploads/${file.trim()}`;
    
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
                    <div key={index} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer', marginBottom: '10px' }}>
                        <Card style={{ width: '150px', height: '150px', border: '1px solid #ddd' }}>
                            <Card.Body style={{ padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FileIcon style={{ fontSize: '100px', color: '#007bff' }} />
                            </Card.Body>
                        </Card>
                    </div>
                );
            }
        });
    };
    

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header>
                <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', marginLeft: '120px', marginRight: '120px' }}>VIEW ANNOUNCEMENT</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                    <p style={{ fontWeight: 'bold' }}>Title:</p>
                    <p>{announcement.title}</p>

                    <p style={{ fontWeight: 'bold' }}>Content:</p>
                    <p>{announcement.content}</p>

                    <p style={{ fontWeight: 'bold' }}>Attachments:</p>
                    <div>
                        {renderFileTiles(announcement.filenames.split(','), true)}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};


export default ViewAnnouncementModal;
