import React from 'react';
import { Modal, Card, Button } from 'react-bootstrap';  
import { MdFilePresent } from "react-icons/md";

const ViewAnnouncementModal = ({ show, onHide, announcement }) => {
    const renderFileTiles = (files) => {
        return files.map((file, index) => {
            const fileExtension = file.split('.').pop().toLowerCase();
            const fileUrl = `http://localhost:9000/uploads/${file.trim()}`;
            const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    
            if (isImage) {
                return (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <img src={fileUrl} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }} />
                        </a>
                    </div>
                );
            } else {
                return (
                    <div key={index} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer', marginBottom: '50px' }}>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <Card style={{ width: '100px', height: '100px', border: '1px solid #0D4809', marginRight: '10px' }}>
                                <Card.Body style={{ padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <MdFilePresent style={{ fontSize: '90px', color: '#0D4809' }} />
                                </Card.Body>       
                                <p style={{ textAlign: 'center', marginTop: '5px', fontSize: '10px', wordWrap: 'break-word' }}> {file.trim()} </p>
                            </Card>
                        </a>
                    </div>
                );
            }
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header>
                <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>×</Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', marginLeft: '120px', marginRight: '120px' }}>VIEW ANNOUNCEMENT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                    <p style={{ fontWeight: 'bold' }}>Title:</p>
                    <p>{announcement.title}</p>

                    <p style={{ fontWeight: 'bold' }}>Content:</p>
                    <p>{announcement.content}</p>

                    <p style={{ fontWeight: 'bold' }}>Attachments:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {renderFileTiles(announcement.filenames.split(','))}
                    </div>

                    <p style={{ fontWeight: 'bold' }}>Date Updated:</p>
                    <p>
                        {announcement.updated_at
                            ? `${new Date(announcement.updated_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}, ${new Date(announcement.updated_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}`
                            : 'N/A'}
                    </p>
                </div>
            </Modal.Body>
        </Modal>
    );
};


export default ViewAnnouncementModal;
