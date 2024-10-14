// EditCategoryModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditCategoryModal = ({
    show,
    onHide,
    categoryFormData,
    setCategoryFormData,
    fetchCategories,
    editCategoryId,
}) => {
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:9000/category/${editCategoryId}`,
                categoryFormData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Category Updated Successfully!',
                text: response.data.message,
            });
            onHide(); // Close the modal after successful update
            fetchCategories(); // Fetch the updated categories
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the category. Please try again later!',
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (show) {
            // Reset form data when the modal is opened
            setCategoryFormData({
                category_name: categoryFormData?.category_name || '',
                status: categoryFormData?.status || '',
            });
        }
    }, [show, setCategoryFormData]); // Removed categoryFormData from dependencies

    return (
        <Modal show={show} onHide={onHide}>
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
                            value={categoryFormData?.category_name || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategoryStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={categoryFormData?.status || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCategoryModal;
