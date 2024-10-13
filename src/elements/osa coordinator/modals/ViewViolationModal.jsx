// ViewViolationModal.js
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ViewViolationModal = ({ show, onHide, selectedRecord, getCategoryName, getOffenseName, getSanctionName, getAcademicYearName, getSemesterName }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: '100px' }}>RECORD DETAILS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedRecord && (
                    <div>
                        <p><strong>Record ID:</strong> {selectedRecord.record_id}</p>
                        <p><strong>Category:</strong> {getCategoryName(selectedRecord.category_id)}</p>
                        <p><strong>Offense:</strong> {getOffenseName(selectedRecord.offense_id)}</p>
                        <p><strong>Sanction:</strong> {getSanctionName(selectedRecord.sanction_id)}</p>
                        <p><strong>Academic Year:</strong> {getAcademicYearName(selectedRecord.acadyear_id)}</p>
                        <p><strong>Semester:</strong> {getSemesterName(selectedRecord.semester_id)}</p>
                        <p><strong>Description:</strong> {selectedRecord.description}</p>
                        <p><strong>Created At:</strong> {selectedRecord.created_at}</p>
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

export default ViewViolationModal;
