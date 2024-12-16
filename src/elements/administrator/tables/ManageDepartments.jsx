import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';

import AddDepartmentModal from '../modals/AddDepartmentModal';
import EditDepartmentModal from '../modals/EditDepartmentModal';


export default function ManageDepartments() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [departmentFormData, setDepartmentFormData] = useState({
        department_code: '',
        department_name: '',
        status: '',
    });
    const [editDepartmentId, setEditDepartmentId] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch departments');
            setLoading(false);
        }
    };

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

    const handleDepartmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-department', departmentFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire('Department Added', 'New department added successfully', 'success');
            handleCloseDepartmentModal();
            fetchDepartments();
        } catch (error) {
            Swal.fire('Error', 'Failed to add department', 'error');
        }
    };

    const handleEditDepartment = (id) => {
        const department = departments.find(dept => dept.department_id === id);
        setDepartmentFormData({ department_code: department.department_code, department_name: department.department_name, status: department.status });
        setEditDepartmentId(id);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/department/${editDepartmentId}`, departmentFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire('Department Updated', 'Department updated successfully', 'success');
            setShowEditModal(false);
            fetchDepartments();
        } catch (error) {
            Swal.fire('Error', 'Failed to update department', 'error');
        }
    };

    const handleDeleteDepartment = (id) => {
        Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this department?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/department/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted', 'Department has been deleted', 'success');
                    fetchDepartments();
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete department', 'error');
                }
            }
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                {/* Small Rectangle on Top */}
                <div
                    style={{
                        backgroundColor: '#e9e9e9', // White background
                        height: '80px', // Small height
                        width: '50%', // 3/4 of the large rectangle width
                        position: 'absolute', // Position it on top of the large rectangle
                        top: '5%', 
                        left: '8%', 
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '80px',
                    }}
                >
                    <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#1f1f1f', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '40px' }}>
                        Manage Departments
                    </h6>
                </div>

                {/* Main Rectangle */}
                <div
                    style={{
                        backgroundColor: '#e9e9e9', 
                        paddingTop: '10px',
                        paddingBottom: '20px',
                        marginBottom: '80px',
                        marginRight: '25px',
                        borderRadius: '10px 20px 10px 10px',
                        width: '90%',
                        height: '20%',
                        margin: 'auto',
                        position: 'relative', // Keep it relative for positioning the small rectangle
                        marginTop: '100px', // This ensures no space between the two rectangles
                        top: '40%'
                    }}
                >
                <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '830px' }}><SearchAndFilter /></div>
                    <button
                        onClick={handleCreateNewDepartment}
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
                        Add Department
                        <FaPlus style={{ marginLeft: '10px' }} />
                    </button>
                </div>
                

                {/* Departments Table */}
                <div>
                    <table
                        className="table table-hover table-bordered"
                        style={{ marginTop: '10px', marginBottom: '20px', marginLeft: '50px', width: '90%' }}
                    >
                        <thead style={{ backgroundColor: '#FAD32E', textAlign: 'center' }}>
                            <tr>
                                <th style={{ width: '5%' }}>ID</th>
                                <th style={{ width: '20%' }}>Department Code</th>
                                <th>Department Name</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: 'center' }}>
                            {departments.map((department) => (
                                <tr key={department.department_id}>
                                    <td style={{ textAlign: 'center' }}>{department.department_id}</td>
                                    <td>{department.department_code}</td>
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
                            ))}
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
                    inputStyle={{ width: '100%' }}
                    buttonStyle={{ marginTop: '20px', backgroundColor: '#FAD32E', border: 'none' }}
                />
    
                {/* Edit Department Modal */}
                <EditDepartmentModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    handleSubmit={handleEditSubmit}
                    departmentFormData={departmentFormData}
                    handleChange={handleDepartmentChange}
                    inputStyle={{ width: '100%' }}
                    buttonStyle={{ marginTop: '20px', backgroundColor: '#FAD32E', border: 'none' }}
                />
            </div>
        </div>
    );
}