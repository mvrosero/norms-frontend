import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddSanctionModal = ({ show, onHide, fetchSanctions }) => {
    const [sanctionFormData, setSanctionFormData] = React.useState({
        sanction_code: '',
        sanction_name: '',
        status: 'Active', // Default status can be set here
    });

    const handleSanctionChange = (e) => {
        const { name, value } = e.target;
        setSanctionFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSanctionSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-sanction', sanctionFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            Swal.fire({
                icon: 'success',
                title: 'Sanction Added Successfully!',
                text: 'The new sanction has been added successfully.',
            });
            onHide(); // Close the modal
            fetchSanctions(); // Fetch updated sanctions list
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the sanction. Please try again later!',
            });
        }
    };

    // Styles defined
    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%',
    };

    const buttonStyle = {
        backgroundColor: '#28a745',
        color: 'white',
        fontWeight: '600',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Sanction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSanctionSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sanction Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="sanction_code"
                            value={sanctionFormData.sanction_code}
                            onChange={handleSanctionChange}
                            required
                            style={inputStyle} // Apply input style
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sanction Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="sanction_name"
                            value={sanctionFormData.sanction_name}
                            onChange={handleSanctionChange}
                            required
                            style={inputStyle} // Apply input style
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={sanctionFormData.status}
                            onChange={handleSanctionChange}
                            required
                            style={inputStyle} // Apply input style
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" variant="success" style={buttonStyle}> {/* Apply button style */}
                        Add Sanction
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddSanctionModal;
