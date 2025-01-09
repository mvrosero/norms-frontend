import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ViewRecordModal = ({ show, onHide, record, getCategoryName, getOffenseName, getSubcategoryName, getSanctionNames, getAcademicYearName, getSemesterName }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static" >
            <Modal.Header>
                <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW VIOLATION RECORD</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '60px', marginRight: '20px' }}>
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

                    <p style={{ fontWeight: 'bold' }}>Academic Year:</p>
                    <p>{getAcademicYearName(record.acadyear_id)}</p>

                    <p style={{ fontWeight: 'bold' }}>Semester:</p>
                    <p>{getSemesterName(record.semester_id)}</p>

                    <p style={{ fontWeight: 'bold' }}>Category:</p>
                    <p>{getCategoryName(record.category_id)}</p>

                    <p style={{ fontWeight: 'bold' }}>Subcategory:</p>
                    <p>{getSubcategoryName(record.subcategory_id)}</p>

                    <p style={{ fontWeight: 'bold' }}>Offense:</p>
                    <p>{getOffenseName(record.offense_id)}</p>

                    <p style={{ fontWeight: 'bold' }}>Sanctions:</p>
                    <p>{getSanctionNames(record.sanction_ids)}</p>

                    <p style={{ fontWeight: 'bold' }}>Description:</p>
                    <p>{record.description}</p>
                </div>
            </Modal.Body>
        </Modal>
    );
};


export default ViewRecordModal;
