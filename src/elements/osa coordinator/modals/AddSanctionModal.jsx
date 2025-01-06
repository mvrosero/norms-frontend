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

const AddSanctionModal = ({ show, handleClose, sanctionFormData, handleSanctionChange, handleSanctionSubmit }) => {
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
                <Modal.Title style={{ fontSize: '30px', marginLeft: '85px', marginRight: '85px' }}> ADD SANCTION </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSanctionSubmit}>
                <Row className="gy-4">
                    <Form.Group className="formSanctionCode">
                        <Form.Label className="fw-bold">Sanction Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="sanction_code"
                            value={sanctionFormData.sanction_code}
                            onChange={handleSanctionChange}
                            onFocus={() => handleFocus('sanction_code')}
                            onBlur={handleBlur}
                            style={ activeField === 'sanction_code' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                    <Form.Group className="formSanctionName">
                        <Form.Label className="fw-bold">Sanction Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="sanction_name"
                            value={sanctionFormData.sanction_name}
                            onChange={handleSanctionChange}
                            onFocus={() => handleFocus('sanction_name')}
                            onBlur={handleBlur}
                            style={ activeField === 'sanction_name' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                        <Form.Group controlId="formSanctionStatus">
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={sanctionFormData.status}
                                onChange={handleSanctionChange}
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


export default AddSanctionModal;
