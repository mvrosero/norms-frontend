import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditOffenseModal = ({
    show,
    handleClose,
    offenseFormData,
    handleOffenseChange,
    handleOffenseSubmit,
    inputStyle,
    buttonStyle // Assuming you want to use buttonStyle too
}) => (
    <Modal 
        show={show} 
        onHide={handleClose} 
        aria-labelledby="contained-modal-title-vcenter" 
        dialogClassName="modal-90w" 
        centered 
        aria-modal="true"
    >
        <Modal.Header closeButton>
            <Modal.Title>Edit Offense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleOffenseSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Offense Code</Form.Label>
                    <Form.Control
                        type="text"
                        name="offense_code"
                        value={offenseFormData.offense_code}
                        onChange={handleOffenseChange}
                        style={inputStyle}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Offense Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="offense_name"
                        value={offenseFormData.offense_name}
                        onChange={handleOffenseChange}
                        style={inputStyle}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="category_id"
                        value={offenseFormData.category_id}
                        onChange={handleOffenseChange}
                        style={inputStyle}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Subcategory ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="subcategory_id"
                        value={offenseFormData.subcategory_id}
                        onChange={handleOffenseChange}
                        style={inputStyle}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={offenseFormData.status}
                        onChange={handleOffenseChange}
                        style={inputStyle}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Select>
                </Form.Group>
                <Button type="submit" style={buttonStyle}>
                    Update Offense
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
);

export default EditOffenseModal;
