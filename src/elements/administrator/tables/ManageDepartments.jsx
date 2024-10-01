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

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title">Manage Departments</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewDepartment} 
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
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <FaPlus style={{ marginRight: '10px' }} />Add Department
                </button>
            </div>
            <div>
                {/* Departments Table */}
                <table className="table table-hover table-bordered" style={{ marginTop: '20px', width: '80%', margin: 'auto' }}>
                    <thead style={{ backgroundColor: '#FAD32E', textAlign: 'center' }}>
                        <tr>
                            <th>ID</th>
                            <th>Department Code</th>
                            <th>Department Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {departments.map(department => (
                            <tr key={department.department_id}>
                                <td>{department.department_id}</td>
                                <td>{department.department_code}</td>
                                <td>{department.department_name}</td>
                                <td>{department.status}</td>
                                <td>
                                    <EditIcon 
                                        onClick={() => handleEditDepartment(department.department_id)} 
                                        style={{ cursor: 'pointer', marginRight: '15px' }}
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteDepartment(department.department_id)} 
                                        style={{ cursor: 'pointer', color: 'red' }}
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
    );
}
