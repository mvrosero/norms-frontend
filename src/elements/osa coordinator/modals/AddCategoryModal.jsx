import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddCategoryModal = ({ show, handleClose, categoryFormData, setCategoryFormData, fetchCategories }) => {
    // Define initial state for the form data
    const initialFormData = { category_name: '', status: '' };

    // Handle form field changes
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-category', categoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Category Added Successfully!',
                text: 'The new category has been added successfully.',
            });

            // Clear form fields
            setCategoryFormData(initialFormData);

            // Close modal and refresh categories
            handleClose();
            fetchCategories();
        } catch (error) {
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the category. Please try again later!',
            });
        }
    };

    // Input styles
    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%',
    };

    // Button styles
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleCategorySubmit}>
                    <Form.Group controlId="formCategoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="category_name" 
                            value={categoryFormData.category_name} 
                            onChange={handleCategoryChange} 
                            required 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategoryStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select 
                            name="status" 
                            value={categoryFormData.status} 
                            onChange={handleCategoryChange} 
                            required 
                            style={inputStyle}
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" style={buttonStyle}>
                        Add Category <FaPlus style={{ marginLeft: '10px' }} />
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryModal;
