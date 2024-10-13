// ViewIndividualUniformDefianceModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewIndividualUniformDefianceModal = ({ 
    show, 
    handleClose, 
    selectedRecord, 
    employees, 
    renderFile 
}) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Record Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedRecord ? (
                    <div>
                        <p><strong>Slip ID:</strong> {selectedRecord.slip_id}</p>
                        <p><strong>Student ID:</strong> {selectedRecord.student_idnumber}</p>
                        <p>
                            <strong>Submitted By:</strong> 
                            {employees[selectedRecord.submitted_by] || selectedRecord.submitted_by}
                        </p>
                        <p><strong>Status:</strong> {selectedRecord.status}</p>
                        <div>
                            <strong>Files Attached:</strong>
                            {renderFile() ? renderFile() : <p>No files attached.</p>}
                        </div>
                    </div>
                ) : (
                    <p>No record selected. Please select a record to view the details.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewIndividualUniformDefianceModal;
