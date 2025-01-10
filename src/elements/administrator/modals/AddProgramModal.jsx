import React, { useState } from 'react';
import { Modal, Form, Button, Row } from 'react-bootstrap';
import '../../../styles/style.css'


const inputStyle = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ced4da',
    borderRadius: '.25rem',
    marginBottom: '20px',
    height: '40px',
    paddingLeft: '10px',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
};

const activeInputStyle = {
    ...inputStyle,
    borderColor: '#FAD32E',
    border: '2px solid'
};

export default function AddProgramModal({ show, handleClose, handleSubmit, programFormData, handleChange, departments }) {
    const [activeField, setActiveField] = useState(null);

    const handleFocus = (field) => {
        setActiveField(field);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header>
                <Button variant="link" onClick={handleClose} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '30px', textAlign: 'center', width: '100%' }}>
                    ADD PROGRAM
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <Row className="gy-4">
                        <Form.Group controlId="formProgramCode">
                            <Form.Label className="fw-bold">Program Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="program_code"
                                value={programFormData.program_code}
                                onChange={handleChange}
                                onFocus={() => handleFocus('program_code')}
                                onBlur={handleBlur}
                                style={
                                    activeField === 'program_code'
                                        ? activeInputStyle
                                        : inputStyle
                                }
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group controlId="formProgramName">
                            <Form.Label className="fw-bold">Program Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="program_name"
                                value={programFormData.program_name}
                                onChange={handleChange}
                                onFocus={() => handleFocus('program_name')}
                                onBlur={handleBlur}
                                style={
                                    activeField === 'program_name'
                                        ? activeInputStyle
                                        : inputStyle
                                }
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group controlId="formDepartmentName">
                            <Form.Label className="fw-bold">Department Name</Form.Label>
                            <Form.Control
                                as="select" 
                                name="department_id" 
                                value={programFormData.department_id}
                                onChange={handleChange}
                                onFocus={() => handleFocus('department_id')}
                                onBlur={handleBlur}
                                style={
                                    activeField === 'department_id'
                                        ? activeInputStyle
                                        : inputStyle
                                }
                                required
                            >
                                <option disabled value="">Select Department</option>
                                {departments.map((department) => (
                                    <option key={department.department_id} value={department.department_id}>
                                        {department.department_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group controlId="formProgramStatus">
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={programFormData.status}
                                onChange={handleChange}
                                onFocus={() => handleFocus('status')}
                                onBlur={handleBlur}
                                style={
                                    activeField === 'status'
                                        ? activeInputStyle
                                        : inputStyle
                                }
                                required
                            >
                                <option disabled value="">
                                    Select Status
                                </option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    {/* Buttons */}
                    <div className="d-flex justify-content-end mt-3">
                        <button type="button" onClick={handleClose} className="settings-cancel-button">Cancel</button>
                        <button type="submit" className="settings-save-button">Save</button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
