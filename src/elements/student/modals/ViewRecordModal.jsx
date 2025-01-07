import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ViewRecordModal = ({
    show,
    onHide,
    record,
    getCategoryName,
    getOffenseName,
    getSubcategoryName,
    getSanctionNames,
    getAcademicYearName,
    getSemesterName
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: '100px' }}>RECORD DETAILS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Created At:</strong> {record.created_at}</p>
                <p><strong>Academic Year:</strong> {getAcademicYearName(record.acadyear_id)}</p>
                <p><strong>Semester:</strong> {getSemesterName(record.semester_id)}</p>
                <p><strong>Category:</strong> {getCategoryName(record.category_id)}</p>
                <p><strong>Subcategory:</strong> {getSubcategoryName(record.subcategory_id)}</p>
                <p><strong>Offense:</strong> {getOffenseName(record.offense_id)}</p>
                <p><strong>Sanction:</strong> {getSanctionNames(record.sanction_ids)}</p>
                <p><strong>Description:</strong> {record.description}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewRecordModal;
