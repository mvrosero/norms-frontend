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

const AddViolationNatureModal = ({ show, handleClose, handleNatureSubmit, natureFormData, handleNatureChange }) => {
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
                <Modal.Title style={{ fontSize: '30px', textAlign: 'center', width: '100%' }}> ADD VIOLATION NATURE </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleNatureSubmit}>
                <Row className="gy-4">
                    <Form.Group className="formNatureCode">
                        <Form.Label className="fw-bold">Nature of Violation Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="nature_code"
                            value={natureFormData.nature_code}
                            onChange={handleNatureChange}
                            onFocus={() => handleFocus('nature_code')}
                            onBlur={handleBlur}
                            style={ activeField === 'nature_code' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                    <Form.Group className="formNatureName">
                        <Form.Label className="fw-bold">Nature of Violation Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="nature_name"
                            value={natureFormData.nature_name}
                            onChange={handleNatureChange}
                            onFocus={() => handleFocus('nature_name')}
                            onBlur={handleBlur}
                            style={ activeField === 'nature_name' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                    
                <Row className="gy-4">
                    <Form.Group controlId="formNatureStatus">
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={natureFormData.status}
                            onChange={handleNatureChange}
                            onFocus={() => handleFocus('status')}
                            onBlur={handleBlur}
                            style={ activeField === 'status' ? activeInputStyle : inputStyle }
                            required
                        >
                            <option disabled value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                </Row>
                    <div className="d-flex justify-content-end mt-3">
                        <button type="button" onClick={handleClose} className="settings-cancel-button">Cancel</button>
                        <button type="submit" className="settings-save-button">Save</button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};


export default AddViolationNatureModal;
