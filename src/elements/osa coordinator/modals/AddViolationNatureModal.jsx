import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddViolationNatureModal = ({ show, handleClose, handleSubmit, natureFormData, handleChange }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Violation Nature</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="nature_code">
                        <Form.Label>Nature Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="nature_code"
                            value={natureFormData.nature_code}
                            onChange={handleChange}
                            placeholder="Enter Nature Code"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="nature_name">
                        <Form.Label>Nature Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="nature_name"
                            value={natureFormData.nature_name}
                            onChange={handleChange}
                            placeholder="Enter Nature Name"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={natureFormData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                        Add Violation Nature
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddViolationNatureModal;
