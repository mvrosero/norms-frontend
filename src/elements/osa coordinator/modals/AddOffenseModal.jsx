import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddOffenseModal = ({
    show,
    handleClose,
    offenseFormData,
    handleOffenseChange,
    handleOffenseSubmit,
    inputStyle
}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Offense</Modal.Title>
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
                    <Button
                        variant="primary"
                        type="submit"
                        style={{ width: '100%' }}
                    >
                        Add Offense
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddOffenseModal;
