// AcademicYearModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function AcademicYearModal({
    show,
    handleClose,
    handleSubmit,
    formData,
    handleChange,
    editMode,
}) {
    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Academic Year Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="acadyear_code"
                            value={formData.acadyear_code}
                            onChange={handleChange}
                            placeholder="Enter academic year code"
                            style={inputStyle}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Year</Form.Label>
                        <Form.Control
                            type="number"
                            name="start_year"
                            value={formData.start_year}
                            onChange={handleChange}
                            placeholder="Enter start year"
                            style={inputStyle}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Year</Form.Label>
                        <Form.Control
                            type="number"
                            name="end_year"
                            value={formData.end_year}
                            onChange={handleChange}
                            placeholder="Enter end year"
                            style={inputStyle}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        {editMode ? 'Update Academic Year' : 'Add Academic Year'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
