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

const AddCategoryModal = ({ show, handleClose, categoryFormData, handleCategoryChange, handleCategorySubmit }) => {
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
                <Modal.Title style={{ fontSize: '30px', textAlign: 'center', width: '100%' }}> ADD CATEGORY </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleCategorySubmit}>
                <Row className="gy-4">
                    <Form.Group className="formCategoryName">
                        <Form.Label className="fw-bold">Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="category_name"
                            value={categoryFormData.category_name}
                            onChange={handleCategoryChange}
                            onFocus={() => handleFocus('category_name')}
                            onBlur={handleBlur}
                            style={ activeField === 'category_name' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                    <Form.Group controlId="formCategoryStatus">
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={categoryFormData.status}
                            onChange={handleCategoryChange}
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


export default AddCategoryModal;
