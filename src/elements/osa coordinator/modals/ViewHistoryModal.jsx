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

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid date'; // Handle invalid date case
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Uniform Defiance Slip Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedRecord ? (
                    <div>
                        <p><strong>Slip ID:</strong> {selectedRecord.slip_id}</p>
                        <p><strong>Student ID:</strong> {selectedRecord.student_idnumber}</p>
                        <p><strong>Violation Nature:</strong> {selectedRecord.nature_name}</p>
                        <p><strong>File Preview:</strong></p>
                        {renderFile()}
                        <p><strong>Status:</strong> {selectedRecord.status}</p>
                        <p><strong>Updated At:</strong> {formatDate(selectedRecord.updated_at)}</p>
                    </div>
                ) : (
                    <p>No record selected.</p>
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

export default ViewHistoryModal;
