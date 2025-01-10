import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewSubcategoryRecordModal = ({ show, onClose, record, subcategoryName }) => {
  if (!record) return null;

  const { created_at, category_name, offense_name, sanction_names, acadyear_name, semester_name, description } = record;


return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" >
        <Modal.Header>
            <Button variant="link" onClick={onClose} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                ×
            </Button>
            <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW VIOLATION RECORD</Modal.Title>
        </Modal.Header>
    <Modal.Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '60px', marginRight: '20px' }}>
            <p style={{ fontWeight: 'bold' }}>Date Created:</p>
            <p>
            {created_at
                ? `${new Date(created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}, ${new Date(created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })}`
                : 'N/A'}
            </p>

            <p style={{ fontWeight: 'bold' }}>Academic Year:</p>
            <p> {acadyear_name} </p>

            <p style={{ fontWeight: 'bold' }}> Semester: </p>
            <p> {semester_name} </p>

            <p style={{ fontWeight: 'bold' }}> Category: </p>
            <p> {category_name} </p>

            <p style={{ fontWeight: 'bold' }}> Subcategory: </p>
            <p> {subcategoryName} </p>

            <p style={{ fontWeight: 'bold' }}>Offense:</p>
            <p> {offense_name} </p>

            <p style={{ fontWeight: 'bold' }}> Sanctions: </p>
            <p> {sanction_names.join(', ')} </p>

            <p style={{ fontWeight: 'bold' }}> Description: </p>
            <p> {description} </p>

        </div>
      </Modal.Body>
    </Modal>
  );
};


export default ViewSubcategoryRecordModal;
