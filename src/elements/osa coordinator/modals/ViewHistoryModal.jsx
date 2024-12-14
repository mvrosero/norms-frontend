import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewHistoryModal = ({ show, onHide, selectedRecord }) => {
    const renderFile = () => {
        if (selectedRecord) {
            const { photo_video_filenames } = selectedRecord;
            const filenames = photo_video_filenames.split(',');

            return filenames.map((filename, index) => {
                const fileExtension = filename.split('.').pop().toLowerCase();
                const fileUrl = `http://localhost:9000/uploads/${filename.trim()}`;

                if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
                    return (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <video controls src={fileUrl} style={{ maxWidth: '100%' }} />
                            </a>
                        </div>
                    );
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
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
            {/* Modal Header */}
            <Modal.Header>
                {/* Custom "X" Close Icon */}
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
                <Modal.Title style={{ fontSize: '40px', marginBottom: '20px', marginLeft: '100px', marginRight: '100px' }}>UNIFORM DEFIANCE SLIP</Modal.Title>
            </Modal.Header>
            {/* Modal Body */}
            <Modal.Body>
                {selectedRecord ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '20px', marginRight: '20px' }}>
                        <p style={{ fontWeight: 'bold' }}>Student ID Number:</p>
                        <p>{selectedRecord.student_idnumber}</p>

                        <p style={{ fontWeight: 'bold' }}>Nature of Violation:</p>
                        <p>{selectedRecord.nature_name}</p>

                        <p style={{ fontWeight: 'bold' }}>Files Attached:</p>
                        <div>{renderFile()}</div>

                        <p style={{ fontWeight: 'bold' }}>Status:</p>
                        <p>{renderStatus(selectedRecord.status)}</p>

                        <p style={{ fontWeight: 'bold' }}>Created At:</p>
                        <p>{new Date(selectedRecord.created_at).toLocaleString()}</p>

                        <p style={{ fontWeight: 'bold' }}>Updated At:</p>
                        <p>{new Date(selectedRecord.updated_at).toLocaleString()}</p>

                        <p style={{ fontWeight: 'bold' }}>Submitted By:</p>
                        <p>{selectedRecord.full_name}</p>
                    </div>
                ) : (
                    <p>No record selected.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ViewHistoryModal;
