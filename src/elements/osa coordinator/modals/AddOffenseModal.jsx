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

const AddOffenseModal = ({ show, handleClose, offenseFormData, handleOffenseChange, handleOffenseSubmit, categories, subcategories }) => {
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
                <Modal.Title style={{ fontSize: '30px', textAlign: 'center', width: '100%' }}> ADD OFFENSE </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleOffenseSubmit}>
                <Row className="gy-4">
                    <Form.Group className="formOffenseCode">
                        <Form.Label className="fw-bold">Offense Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="offense_code"
                            value={offenseFormData.offense_code}
                            onChange={handleOffenseChange}
                            onFocus={() => handleFocus('offense_code')}
                            onBlur={handleBlur}
                            style={ activeField === 'offense_code' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                    <Form.Group className="formOffenseName">
                        <Form.Label className="fw-bold">Offense Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="offense_name"
                            value={offenseFormData.offense_name}
                            onChange={handleOffenseChange}
                            onFocus={() => handleFocus('offense_name')}
                            onBlur={handleBlur}
                            style={ activeField === 'offense_name' ? activeInputStyle : inputStyle }
                            required
                        />
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                    <Form.Group controlId="formCategoryName">
                        <Form.Label className="fw-bold">Category Name</Form.Label>
                        <Form.Control
                            as="select" 
                            name="category_id" 
                            value={offenseFormData.category_id}
                            onChange={handleOffenseChange}
                            onFocus={() => handleFocus('category_id')}
                            onBlur={handleBlur}
                            style={ activeField === 'category_id' ? activeInputStyle : inputStyle }
                            required
                        >
                            <option disabled value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                    <Form.Group controlId="formSubcategoryName">
                        <Form.Label className="fw-bold">Subcategory Name</Form.Label>
                        <Form.Control
                            as="select" 
                            name="subcategory_id" 
                            value={offenseFormData.subcategory_id}
                            onChange={handleOffenseChange}
                            onFocus={() => handleFocus('subcategory_id')}
                            onBlur={handleBlur}
                            style={ activeField === 'subcategory_id' ? activeInputStyle : inputStyle }
                            required
                        >
                            <option disabled value="">Select Subcategory</option>
                            {subcategories.map((subcategory) => (
                                <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                    {subcategory.subcategory_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Row>

                <Row className="gy-4">
                        <Form.Group controlId="formOffenseStatus">
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={offenseFormData.status}
                                onChange={handleOffenseChange}
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


export default AddOffenseModal;
