import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';

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
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);

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
            console.error(error);
            setError('Failed to fetch departments');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewDepartment = () => {
        setShowDepartmentModal(true);
    };

    const handleCloseDepartmentModal = () => {
        setShowDepartmentModal(false);
        setDepartmentFormData({
            department_code: '',
            department_name: '',
            status: '',
        });
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
            Swal.fire({
                icon: 'success',
                title: 'Department Added Successfully!',
                text: 'The new department has been added successfully.',
            });
            handleCloseDepartmentModal();
            fetchDepartments();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the department. Please try again later!',
            });
        }
    };

    const handleEditDepartment = (id) => {
        const department = departments.find(dept => dept.department_id === id);
        if (department) {
            setDepartmentFormData({
                department_code: department.department_code,
                department_name: department.department_name,
                status: department.status,
            });
            setEditDepartmentId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/department/${editDepartmentId}`, departmentFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Department Updated Successfully!',
                text: 'The department has been updated successfully.',
            });
            setShowEditModal(false);
            fetchDepartments();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the department. Please try again later!',
            });
        }
    };

    const handleDeleteDepartment = (id) => {
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
                    await axios.delete(`http://localhost:9000/department/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted!', 'The department has been deleted.', 'success');
                    fetchDepartments();
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the department. Please try again later!',
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

    const buttonStyle = {
        backgroundColor: '#28a745',
        color: 'white',
        fontWeight: '600',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

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
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Add Department
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Department Code</th>
                            <th>Department Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department) => (
                            <tr key={department.department_id}>
                                <td>{department.department_code}</td>
                                <td>{department.department_name}</td>
                                <td>{department.status}</td>
                                <td>
                                    <EditIcon onClick={() => handleEditDepartment(department.department_id)} style={{ cursor: 'pointer' }} />
                                    <DeleteIcon onClick={() => handleDeleteDepartment(department.department_id)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Department Modal */}
            <Modal show={showDepartmentModal} onHide={handleCloseDepartmentModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleDepartmentSubmit}>
                        <Form.Group controlId="formDepartmentCode">
                            <Form.Label>Department Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="department_code" 
                                value={departmentFormData.department_code}
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formDepartmentName">
                            <Form.Label>Department Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="department_name" 
                                value={departmentFormData.department_name}
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formDepartmentStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="status" 
                                value={departmentFormData.status}
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={buttonStyle}>
                            Add Department
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Department Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="editFormDepartmentCode">
                            <Form.Label>Department Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="department_code" 
                                value={departmentFormData.department_code}
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="editFormDepartmentName">
                            <Form.Label>Department Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="department_name" 
                                value={departmentFormData.department_name}
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="editFormDepartmentStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="status" 
                                value={departmentFormData.status}
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={buttonStyle}>
                            Update Department
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
