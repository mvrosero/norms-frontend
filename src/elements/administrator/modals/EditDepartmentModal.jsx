import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function EditDepartmentModal({ show, handleClose, handleSubmit, departmentFormData, handleChange, inputStyle, buttonStyle }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Department</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="editFormDepartmentCode">
                        <Form.Label>Department Code</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="department_code" 
                            value={departmentFormData.department_code}
                            onChange={handleChange} 
                            style={inputStyle} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="editFormDepartmentName">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="department_name" 
                            value={departmentFormData.department_name}
                            onChange={handleChange} 
                            style={inputStyle} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="editFormDepartmentStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="status" 
                            value={departmentFormData.status}
                            onChange={handleChange} 
                            style={inputStyle} 
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" style={buttonStyle}>
                        Update Department
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
