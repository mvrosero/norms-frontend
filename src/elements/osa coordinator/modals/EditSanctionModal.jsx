import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditSanctionModal = ({ 
    show, 
    onHide, 
    sanctionFormData, 
    handleSanctionChange, 
    handleEditSubmit 
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Sanction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sanction Code</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="sanction_code" 
                            value={sanctionFormData.sanction_code}
                            onChange={handleSanctionChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sanction Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="sanction_name" 
                            value={sanctionFormData.sanction_name}
                            onChange={handleSanctionChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Control 
                            as="select"  // Changed to a select dropdown for status
                            name="status" 
                            value={sanctionFormData.status}
                            onChange={handleSanctionChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button 
                        type="submit" 
                        style={{ backgroundColor: '#FAD32E', color: 'white' }}
                    >
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditSanctionModal;
