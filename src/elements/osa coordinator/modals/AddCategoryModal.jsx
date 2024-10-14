import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddCategoryModal = ({ show, onHide, categoryFormData, setCategoryFormData, fetchCategories }) => {
    const [isLoading, setIsLoading] = React.useState(false); // Manage loading state

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        try {
            await axios.post('http://localhost:9000/register-category', categoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Category Added Successfully!',
                text: 'The new category has been added successfully.',
            });
            onHide();
            fetchCategories();
            // Reset form data to its initial state
            setCategoryFormData({ category_name: '', status: '' }); 
        } catch (error) {
            console.error("Error adding category:", error); // Log error for debugging
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the category. Please try again later!',
            });
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleCategorySubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="category_name" 
                            value={categoryFormData.category_name}
                            onChange={handleCategoryChange}
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="status" 
                            value={categoryFormData.status}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    
                    <Button 
                        type="submit" 
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            fontWeight: '600',
                            padding: '12px 15px',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? 'Adding...' : 'Add Category'} {/* Change button text based on loading */}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryModal;
