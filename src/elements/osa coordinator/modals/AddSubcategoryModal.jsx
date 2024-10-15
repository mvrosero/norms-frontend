// AddSubcategoryModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddSubcategoryModal = ({ show, onHide, formData, onChange, onSubmit }) => {
    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Subcategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="subcategory_code">
                        <Form.Label>Subcategory Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="subcategory_code"
                            value={formData.subcategory_code}
                            onChange={onChange}
                            required
                            style={inputStyle}
                        />
                    </Form.Group>

                    <Form.Group controlId="subcategory_name" className="mt-3">
                        <Form.Label>Subcategory Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="subcategory_name"
                            value={formData.subcategory_name}
                            onChange={onChange}
                            required
                            style={inputStyle}
                        />
                    </Form.Group>

                    <Form.Group controlId="status" className="mt-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={onChange}
                            required
                            style={inputStyle}
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit" style={{ marginTop: '15px' }}>
                        Add Subcategory
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddSubcategoryModal;
