// EditSanctionModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditSanctionModal = ({ show, handleClose, handleSubmit, sanctionFormData, handleChange, isSubmitting }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Sanction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="sanction_code">
                        <Form.Label>Sanction Code</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="sanction_code" 
                            value={sanctionFormData.sanction_code} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter sanction code"
                        />
                    </Form.Group>
                    <Form.Group controlId="sanction_name">
                        <Form.Label>Sanction Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="sanction_name" 
                            value={sanctionFormData.sanction_name} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter sanction name"
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="status" 
                            value={sanctionFormData.status}  
                            onChange={handleChange} 
                            required // This ensures a selection is mandatory
                        >
                            <option value="">Select status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Update Sanction'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditSanctionModal;
