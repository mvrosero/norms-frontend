import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditViolationNatureModal = ({ show, handleClose, handleSubmit, natureFormData, handleChange }) => {
    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%',
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Violation Nature</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="nature_code">
                        <Form.Label>Violation Nature Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="nature_code"
                            value={natureFormData.nature_code}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="nature_name">
                        <Form.Label>Violation Nature Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="nature_name"
                            value={natureFormData.nature_name}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={natureFormData.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" type="submit">Update Nature</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditViolationNatureModal;