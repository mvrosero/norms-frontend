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

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: '60px' }}>UNIFORM DEFIANCE SLIP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {record && (
                    <div>
                        <p><strong>Slip ID:</strong> {record.slip_id}</p>
                        <p><strong>Nature of Violation:</strong> {record.nature_name}</p>
                        <p><strong>Files Attached:</strong></p>
                        {renderFile()}
                        <p><strong>Status:</strong> {record.status}</p>
                        <p><strong>Created At:</strong> {new Date(record.created_at).toLocaleString()}</p>
                        <p><strong>Submitted By:</strong> {record.submitted_by}</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewUniformDefianceModal;
