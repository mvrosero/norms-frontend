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
                    return <p key={index}>Unsupported file format</p>; // Handle unsupported formats
                }
            });
        }
        return null;
    };

    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'Active') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'Inactive') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else if (status === 'Pending') {
            backgroundColor = '#FFF5DC';
            textColor = '#FFC107';
        } else {
            backgroundColor = '#EDEDED';
            textColor = '#6C757D'; // Default for unknown status
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
        <Modal show={show} onHide={onHide}>
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
                <Modal.Title style={{ marginLeft: '60px' }}>UNIFORM DEFIANCE SLIP</Modal.Title>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body>
                {record && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px' }}>
                        <p style={{ fontWeight: 'bold' }}>ID Number:</p>
                        <p>{record.student_idnumber}</p>

                        <p style={{ fontWeight: 'bold' }}>Violation Nature:</p>
                        <p>{record.nature_name}</p>

                        <p style={{ fontWeight: 'bold' }}>Files Attached:</p>
                        <div>{renderFile()}</div>

                        <p style={{ fontWeight: 'bold' }}>Status:</p>
                        <p>{renderStatus(record.status)}</p>

                        <p style={{ fontWeight: 'bold' }}>Created At:</p>
                        <p>{new Date(record.created_at).toLocaleString()}</p>

                        <p style={{ fontWeight: 'bold' }}>Submitted By:</p>
                        <p>{record.submitted_by}</p>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ViewUniformDefianceModal;
