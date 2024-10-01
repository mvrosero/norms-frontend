import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function AddProgramModal({ show, handleClose, handleSubmit, programFormData, handleChange, inputStyle, buttonStyle }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Program</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formProgramCode">
                        <Form.Label>Program Code</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="program_code" 
                            value={programFormData.program_code}
                            onChange={handleChange} 
                            style={inputStyle} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="formProgramName">
                        <Form.Label>Program Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="program_name" 
                            value={programFormData.program_name}
                            onChange={handleChange} 
                            style={inputStyle} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="formDepartmentId">
                        <Form.Label>Department ID</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="department_id" 
                            value={programFormData.department_id}
                            onChange={handleChange} 
                            style={inputStyle} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="formProgramStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="status" 
                            value={programFormData.status}
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
                        Add Program
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
