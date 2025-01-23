import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import AddDepartmentModal from '../modals/AddDepartmentModal';
import EditDepartmentModal from '../modals/EditDepartmentModal';
import SFforSettingsTable from '../searchandfilters/SFforSettingsTable';
import folderBackground from '../../../components/images/folder_background.png';

export default function ManageDepartments() {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [departmentFormData, setDepartmentFormData] = useState({
        department_code: '',
        department_name: '',
        status: '',
    });
    const [allItems, setAllItems] = useState([]);  
    const [editDepartmentId, setEditDepartmentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const navigate = useNavigate();


    // Fetch departments
    const fetchDepartments = useCallback(async () => {
        setLoading(true); 
        setError(null); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('https://test-backend-api-2.onrender.com/departments', { headers });
            setDepartments(response.data);
            setAllItems(response.data);  
            setFilteredDepartments(response.data);  
            setLoading(false);
        } catch (error) {
            console.error('Error fetching departments:', error.response || error.message || error);
            setError(true); 
            setLoading(false);
        }
    }, []);


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Handle filter changes (status)
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);
    };

    // Apply search query and filters to departments
    useEffect(() => {
        const filtered = allItems.filter(department => {
            const normalizedQuery = searchQuery.toLowerCase();
            const matchesQuery = 
                department.department_code.toLowerCase().includes(normalizedQuery) ||
                department.department_name.toLowerCase().includes(normalizedQuery);

            const matchesStatus = filters.status ? department.status === filters.status : true;

            return matchesQuery && matchesStatus;
        });

        setFilteredDepartments(filtered);
    }, [searchQuery, filters, allItems]);

    // Fetch departments on initial render
    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);


    const handleCreateNewDepartment = () => {
        setShowDepartmentModal(true);
    };

    const handleCloseDepartmentModal = () => {
        setShowDepartmentModal(false);
        setDepartmentFormData({ department_code: '', department_name: '', status: '' });
    };

    const handleDepartmentChange = (e) => {
        const { name, value } = e.target;
        setDepartmentFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    

    // Handle the create department
    const handleDepartmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://test-backend-api-2.onrender.com/register-department', departmentFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire('Department Added', 'New department added successfully', 'success');
            handleCloseDepartmentModal();
            fetchDepartments();
        } catch (error) {
            Swal.fire('Error', 'Failed to add department', 'error');
        }
    };


    // Handle the edit department
    const handleEditDepartment = (id) => {
        const department = departments.find(dept => dept.department_id === id);
        setDepartmentFormData({ department_code: department.department_code, department_name: department.department_name, status: department.status });
        setEditDepartmentId(id);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://test-backend-api-2.onrender.com/department/${editDepartmentId}`, departmentFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire('Department Updated', 'Department updated successfully', 'success');
            setShowEditModal(false);
            fetchDepartments();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred while saving the department. Please try again later!';
            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            });
        }
    };


    // Handle the delete department
    const handleDeleteDepartment = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this department?',
            text: 'Deleting this department will also affect all associated data.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://test-backend-api-2.onrender.com/department/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted', 'Department has been deleted and associated data is affected', 'success');
                    fetchDepartments();
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete department', 'error');
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
        <AdminNavigation />
        <AdminInfo />
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
                        Manage Departments
                    </h6>
                </div>
    
                {/* Search and Add Button */}
                <div style={{  marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '850px' }}><SFforSettingsTable onSearch={handleSearch} onFilterChange={handleFilterChange}/></div>
                    <button
                        onClick={handleCreateNewDepartment}
                        style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 18px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            Add Department
                        <FaPlus style={{ marginLeft: '10px' }} />
                    </button>
                </div>
    
                {/* Departments Table */}
                <div style={{ width: '90%', marginBottom: '40px' }}>
                    <table className="table table-hover table-bordered" style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                        <thead style={{ backgroundColor: '#FAD32E', textAlign: 'center' }}>
                            <tr>
                                <th style={{ width: '5%'}}>No.</th>
                                <th style={{ width: '20%' }}>Department Code</th>
                                <th>Department Name</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((department, index) => (
                                <tr key={department.department_id}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ textAlign: 'center' }}>{department.department_code}</td>
                                    <td>{department.department_name}</td>
                                    <td style={{ textAlign: 'center' }}>{renderStatus(department.status)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <EditIcon
                                            onClick={() => handleEditDepartment(department.department_id)}
                                            style={{ cursor: 'pointer', color: '#007bff', marginRight: '15px' }}
                                        />
                                        <DeleteIcon
                                            onClick={() => handleDeleteDepartment(department.department_id)}
                                            style={{ cursor: 'pointer', color: '#dc3545' }}
                                        />
                                    </td>
                                </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No departments found</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
    
    
                {/* Add Department Modal */}
                <AddDepartmentModal
                    show={showDepartmentModal}
                    handleClose={handleCloseDepartmentModal}
                    handleSubmit={handleDepartmentSubmit}
                    departmentFormData={departmentFormData}
                    handleChange={handleDepartmentChange}
                />
    
                {/* Edit Department Modal */}
                <EditDepartmentModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    handleSubmit={handleEditSubmit}
                    departmentFormData={departmentFormData}
                    handleChange={handleDepartmentChange}
                />
            </div>
        </div>
    );
};