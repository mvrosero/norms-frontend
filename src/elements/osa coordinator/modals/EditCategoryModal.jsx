import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditCategoryModal = ({ show, handleClose, categoryFormData, setCategoryFormData, fetchCategories, editCategoryId }) => {
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/category/${editCategoryId}`, categoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            Swal.fire({
                icon: 'success',
                title: 'Category Updated Successfully!',
                text: 'The category has been updated successfully.',
            });
            handleClose(); // Close modal after success
            fetchCategories(); // Refresh categories
        } catch (error) {
            console.error("Error updating category:", error); // Log error for debugging
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'An error occurred while updating the category. Please try again later!',
            });
        }
    };

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: '600',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
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
                            value={categoryFormData.status} // Default to current status
                            onChange={handleCategoryChange} // Handle changes
                            required
                            style={inputStyle} 
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" style={buttonStyle}>
                        Update Category
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCategoryModal;
