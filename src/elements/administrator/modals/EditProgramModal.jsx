import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function EditProgramModal({ show, handleClose, handleSubmit, programFormData, handleChange, inputStyle, buttonStyle }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Program</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="editFormProgramCode">
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
                    <Form.Group controlId="editFormProgramName">
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
                    <Form.Group controlId="editFormDepartmentID">
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
                    <Form.Group controlId="editFormProgramStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={programFormData.status}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        >
                            <option value={programFormData.status}>
                                {programFormData.status || "Select Status"}
                            </option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" style={buttonStyle}>
                        Update Program
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
