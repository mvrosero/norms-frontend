import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaPlus } from 'react-icons/fa';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import AddCategoryModal from '../../elements/osa coordinator/modals/AddCategoryModal';
import EditCategoryModal from '../../elements/osa coordinator/modals/EditCategoryModal';

export default function ManageCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        category_name: '',
        status: ''
    });
    const [editCategoryId, setEditCategoryId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

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
            category_name: '',
            status: ''
        });
    };

    const handleEditCategory = (id) => {
        const category = categories.find(cat => cat.category_id === id);
        if (category) {
            setCategoryFormData({
                category_name: category.category_name,
                status: category.status
            });
            setEditCategoryId(id);
            setShowEditModal(true);
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

            <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px', marginBottom: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Category Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th> {/* Added Status Column */}
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.category_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{category.category_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{category.category_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{category.status}</td> {/* Display Status */}
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon onClick={() => handleEditCategory(category.category_id)} style={{ cursor: 'pointer', color: 'blue' }} />
                                    <DeleteIcon onClick={() => handleDeleteCategory(category.category_id)} style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            <AddCategoryModal 
                show={showCategoryModal} 
                handleClose={handleCloseCategoryModal} 
                categoryFormData={categoryFormData} 
                setCategoryFormData={setCategoryFormData} 
                fetchCategories={fetchCategories} 
            />
            <EditCategoryModal 
                show={showEditModal} 
                handleClose={() => setShowEditModal(false)} 
                categoryFormData={categoryFormData} 
                setCategoryFormData={setCategoryFormData} 
                fetchCategories={fetchCategories} 
                editCategoryId={editCategoryId} 
            />
        </div>
    );
}
