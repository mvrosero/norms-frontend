import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManageSubcategories() {
    const navigate = useNavigate();
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [subcategoryFormData, setSubcategoryFormData] = useState({
        subcategory_code: '',
        subcategory_name: '',
        status: 'active', // Default status
        category_id: ''
    });
    const [editSubcategoryId, setEditSubcategoryId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchSubcategories();
    }, []);

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://localhost:9000/subcategories', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSubcategories(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch subcategories');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewSubcategory = () => {
        setShowSubcategoryModal(true);
    };

    const handleCloseSubcategoryModal = () => {
        setShowSubcategoryModal(false);
        setSubcategoryFormData({
            subcategory_code: '',
            subcategory_name: '',
            status: 'active', // Reset to default
            category_id: ''
        });
    };

    const handleSubcategoryChange = (e) => {
        const { name, value } = e.target;
        setSubcategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/create-subcategory', subcategoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Subcategory Added Successfully!',
                text: 'The new subcategory has been added successfully.',
            });
            handleCloseSubcategoryModal();
            fetchSubcategories();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the subcategory. Please try again later!',
            });
        }
    };

    const handleEditSubcategory = (id) => {
        const subcategory = subcategories.find(sub => sub.subcategory_id === id);
        if (subcategory) {
            setSubcategoryFormData({
                subcategory_code: subcategory.subcategory_code,
                subcategory_name: subcategory.subcategory_name,
                status: subcategory.status,
                category_id: subcategory.category_id
            });
            setEditSubcategoryId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/subcategory/${editSubcategoryId}`, subcategoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Subcategory Updated Successfully!',
                text: 'The subcategory has been updated successfully.',
            });
            setShowEditModal(false);
            fetchSubcategories();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the subcategory. Please try again later!',
            });
        }
    };

    const handleDeleteSubcategory = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/subcategory/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The subcategory has been deleted.',
                        'success'
                    );
                    fetchSubcategories();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the subcategory. Please try again later!',
                    });
                }
            }
        });
    };

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Subcategories</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewSubcategory} 
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Add Subcategory
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Subcategory Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Subcategory Code</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map((subcategory, index) => (
                            <tr key={subcategory.subcategory_id}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{subcategory.subcategory_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{subcategory.subcategory_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{subcategory.subcategory_code}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{subcategory.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon 
                                        onClick={() => handleEditSubcategory(subcategory.subcategory_id)} 
                                        style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }} 
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteSubcategory(subcategory.subcategory_id)} 
                                        style={{ cursor: 'pointer', color: 'red' }} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Subcategory Modal */}
            <Modal show={showSubcategoryModal} onHide={handleCloseSubcategoryModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Subcategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubcategorySubmit}>
                        <Form.Group controlId="subcategory_code">
                            <Form.Label>Subcategory Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="subcategory_code" 
                                value={subcategoryFormData.subcategory_code} 
                                onChange={handleSubcategoryChange} 
                                required 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId="subcategory_name">
                            <Form.Label>Subcategory Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="subcategory_name" 
                                value={subcategoryFormData.subcategory_name} 
                                onChange={handleSubcategoryChange} 
                                required 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select 
                                name="status" 
                                value={subcategoryFormData.status} 
                                onChange={handleSubcategoryChange} 
                                required 
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ marginTop: '15px' }}>
                            Add Subcategory
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Subcategory Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Subcategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="subcategory_code">
                            <Form.Label>Subcategory Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="subcategory_code" 
                                value={subcategoryFormData.subcategory_code} 
                                onChange={handleSubcategoryChange} 
                                required 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId="subcategory_name">
                            <Form.Label>Subcategory Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="subcategory_name" 
                                value={subcategoryFormData.subcategory_name} 
                                onChange={handleSubcategoryChange} 
                                required 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select 
                                name="status" 
                                value={subcategoryFormData.status} 
                                onChange={handleSubcategoryChange} 
                                required 
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ marginTop: '15px' }}>
                            Update Subcategory
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
