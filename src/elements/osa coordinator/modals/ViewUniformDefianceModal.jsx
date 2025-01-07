import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewUniformDefianceModal = ({ show, onHide, record }) => {
    const renderFile = () => {
        if (record) {
            const { photo_video_filenames } = record;
            const filenames = photo_video_filenames.split(',');

            return filenames.map((filename, index) => {
                const fileExtension = filename.split('.').pop().toLowerCase();
                const fileUrl = `http://localhost:9000/uploads/${filename}`;

                if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov') {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <video controls src={fileUrl} style={{ maxWidth: '100%' }} />
                            </a>
                        </div>
                    );
                } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <img src={fileUrl} alt="File Preview" style={{ maxWidth: '100%' }} />
                            </a>
                        </div>
                    );
                } else {
                    return <p key={index}>Unsupported file format</p>; 
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
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header>
                <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none',fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', marginLeft: '90px', marginRight: '90px' }}>VIEW UNIFORM DEFIANCE</Modal.Title>
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
    );
};


export default ViewUniformDefianceModal;
