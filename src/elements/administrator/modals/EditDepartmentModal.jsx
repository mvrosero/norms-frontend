import React, { useState } from 'react';
import { Modal, Form, Button, Row } from 'react-bootstrap';


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
    borderColor: '#3B71CA',
    border: '2px solid'
};

const buttonStyle = {
    backgroundColor: '#3B71CA',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '900',
    padding: '8px 25px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const cancelButtonStyle = {
    backgroundColor: '#8C8C8C',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '900',
    padding: '8px 25px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

export default function EditDepartmentModal({ show, handleClose, handleSubmit, departmentFormData, handleChange }) {
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
            <Button
                    variant="link"
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '20px',
                        textDecoration: 'none',
                        fontSize: '30px',
                        color: '#a9a9a9',
                    }}
                >
                    ×
                </Button>
                <Modal.Title
                    style={{
                        fontSize: '30px',
                        marginLeft: '60px',
                        marginRight: '60px',
                    }}
                >
                    EDIT DEPARTMENT
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <Row className="gy-4">
                        <Form.Group controlId="editFormDepartmentCode">
                            <Form.Label className="fw-bold">Department Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="department_code"
                                value={departmentFormData.department_code}
                                onChange={handleChange}
                                onFocus={() => handleFocus('department_code')}
                                onBlur={handleBlur}
                                style={
                                    activeField === 'department_code'
                                        ? activeInputStyle
                                        : inputStyle
                                }
                                required
                            />
                        </Form.Group>
                    </Row>
                    <Row className="gy-4">
                        <Form.Group controlId="editFormDepartmentName">
                            <Form.Label className="fw-bold">Department Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="department_name"
                                value={departmentFormData.department_name}
                                onChange={handleChange}
                                onFocus={() => handleFocus('department_name')}
                                onBlur={handleBlur}
                                style={
                                    activeField === 'department_name'
                                        ? activeInputStyle
                                        : inputStyle
                                }
                                required
                            />
                        </Form.Group>
                    </Row>
                    <Row className="gy-4">
                        <Form.Group controlId="editFormDepartmentStatus">
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={departmentFormData.status}
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
                        <Button
                            type="button"
                            onClick={handleClose}
                            style={cancelButtonStyle}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" style={buttonStyle}>
                            Update
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
