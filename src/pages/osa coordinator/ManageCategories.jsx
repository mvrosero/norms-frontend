import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaPlus } from 'react-icons/fa';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import AddCategoryModal from '../../elements/osa coordinator/modals/AddCategoryModal';
import EditCategoryModal from '../../elements/osa coordinator/modals/EditCategoryModal';
import folderBackground from '../../../src/components/images/folder_background.png';

export default function ManageCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({
        category_name: '',
        status: ''
    });


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

    // Fetch categories
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

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    

    // Handle the create category
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
            // Close modal and refresh categories
            handleCloseCategoryModal();
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


     // Handle the edit sanction
     const handleEditCategory = (id) => {
        const category = categories.find(cate => cate.category_id === id);
        if (category) {
            setCategoryFormData({
                category_code: category.category_code,
                category_name: category.category_name,
                status: category.status 
            });
            setEditCategoryId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/category/${editCategoryId}`, categoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            Swal.fire({
                icon: 'success',
                title: 'Sanction Updated Successfully!',
                text: 'The sanction has been updated successfully.',
            });
            setShowEditModal(false);
            fetchCategories();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the sanction. Please try again later!',
            });
        } 
    };


    // Handle the delete sanction
    const handleDeleteCategory = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this category?',
            text: "Deleting this category will also affect all associated data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
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

    
    // Set the styles for the status
    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'active') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'inactive') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else {
            backgroundColor = '#EDEDED';
            textColor = '#6C757D'; 
        }

        return (
            <div style={{
                backgroundColor,
                color: textColor,
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: '30px',
                padding: '5px 20px',
                display: 'inline-flex',
                alignItems: 'center',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: textColor,
                    marginRight: '7px',
                }} />
                {status}
            </div>
        );
    };


return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />
            <div
                style={{
                    backgroundImage: `url(${folderBackground})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    width: '100vw',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    paddingTop: '40px',
                    marginBottom: '20px'
                }}
            >
                
            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '100px' }}>
                    Manage Categories
                </h6>
            </div>

            {/* Search and Add Button */}
            <div style={{  marginTop: '10px', marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '850px' }}><SearchAndFilter /></div>
                <button
                    onClick={handleCreateNewCategory}
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 18px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    Add Category
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Category Table */}
            <div style={{ width: '90%', marginBottom: '40px' }}>
                <table className="table table-hover table-bordered" style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '4%' }}>No.</th>
                            <th style={{ width: '37%' }}>Category Name</th>
                            <th style={{ width: '13%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.category_id}>
                                <td style={{ textAlign: 'center'}}>{(index + 1)}</td>
                                <td style={{ paddingLeft: '20px'}}>{category.category_name}</td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(category.status)}</td> 
                                <td style={{ textAlign: 'center' }}>
                                    <EditIcon 
                                        onClick={() => handleEditCategory(category.category_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }} 
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteCategory(category.category_id)} 
                                        style={{ cursor: 'pointer', color: '#dc3545' }} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add Category Modal */}
        <AddCategoryModal 
            show={showCategoryModal} 
            handleClose={handleCloseCategoryModal} 
            categoryFormData={categoryFormData} 
            handleCategoryChange={handleCategoryChange}
            handleCategorySubmit={handleCategorySubmit}
        />

        {/* Edit Category Modal */}
        <EditCategoryModal 
            show={showEditModal} 
            handleClose={() => setShowEditModal(false)} 
            handleSubmit={handleEditSubmit} 
            categoryFormData={categoryFormData}
            handleCategoryChange={handleCategoryChange} 
        />
    </div>
    );
}
