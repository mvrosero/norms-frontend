// ManageCategories.js
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
import AddCategoryModal from '../../elements/osa coordinator/modals/AddCategoryModal';

export default function ManageCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        category_name: ''
    });
    const [editCategoryId, setEditCategoryId] = useState(null);

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token is missing or role_id is not '2', redirect to unauthorized page
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:9000/categories', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch categories');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewCategory = () => {
        setShowCategoryModal(true);
    };

    const handleCloseCategoryModal = () => {
        setShowCategoryModal(false);
        setCategoryFormData({
            category_name: ''
        });
    };

    const handleEditCategory = (id) => {
        const category = categories.find(cat => cat.category_id === id);
        if (category) {
            setCategoryFormData({
                category_name: category.category_name
            });
            setEditCategoryId(id);
            setShowEditModal(true);
        }
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
            setShowEditModal(false);
            fetchCategories();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the category. Please try again later!',
            });
        }
    };

    const handleDeleteCategory = (id) => {
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
                    await axios.delete(`http://localhost:9000/category/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The category has been deleted.',
                        'success'
                    );
                    fetchCategories();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the category. Please try again later!',
                    });
                }
            }
        });
    };

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Categories</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewCategory} 
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
                    Add Category
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Category Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.category_id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{category.category_id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{category.category_name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{category.status}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <EditIcon 
                                        onClick={() => handleEditCategory(category.category_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff' }} 
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteCategory(category.category_id)} 
                                        style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Add the new modal here */}
            <AddCategoryModal 
                show={showCategoryModal} 
                onHide={handleCloseCategoryModal} 
                categoryFormData={categoryFormData} 
                setCategoryFormData={setCategoryFormData} 
                fetchCategories={fetchCategories} 
            />
            
            {/* Edit Category Modal can be placed here similarly if needed */}
        </div>
    );
}
