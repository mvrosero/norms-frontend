import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManageDepartments() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false); // State for department modal
    const [departmentFormData, setDepartmentFormData] = useState({
        department_code: '',
        department_name: '',
        status: '',
    });

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch departments data
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

        fetchDepartments();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewDepartment = () => {
        setShowDepartmentModal(true);
    };

    const handleCloseDepartmentModal = () => {
        setShowDepartmentModal(false);
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
            const response = await axios.post('http://localhost:9000/register-department', departmentFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Department Added Successfully!',
                text: 'The new department has been added successfully.',
            });
            handleCloseDepartmentModal();
            // Re-fetch departments to include the new one
            const fetchDepartments = async () => {
                try {
                    const response = await axios.get('http://localhost:9000/departments', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    setDepartments(response.data);
                } catch (error) {
                    console.error('Failed to fetch departments', error);
                }
            };
            fetchDepartments();
        } catch (error) {
            console.error('Error adding department:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the department. Please try again later!',
            });
        }
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
            <div style={{ margin: 'auto', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Department Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Department Code</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department, index) => (
                            <tr key={department.department_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'left', border: '1px solid #ddd', padding: '8px' }}>{department.department_id}</td>
                                <td style={{ textAlign: 'left', border: '1px solid #ddd', padding: '8px' }}>{department.department_name}</td>
                                <td style={{ textAlign: 'left', border: '1px solid #ddd', padding: '8px' }}>{department.department_code}</td>
                                <td style={{ textAlign: 'left', border: '1px solid #ddd', padding: '8px' }}>{department.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showDepartmentModal} onHide={handleCloseDepartmentModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleDepartmentSubmit}>
                        <Form.Group controlId='department_code'>
                            <Form.Label className="fw-bold">Department Code</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='department_code' 
                                value={departmentFormData.department_code} 
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId='department_name'>
                            <Form.Label className="fw-bold">Department Name</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='department_name' 
                                value={departmentFormData.department_name} 
                                onChange={handleDepartmentChange} 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId='status'>
                            <Form.Label className="fw-bold">Status</Form.Label>
                            <Form.Select
                                name='status' 
                                value={departmentFormData.status} 
                                onChange={handleDepartmentChange} 
                                style={inputStyle}>
                                <option value=''>Select Status</option>
                                <option value='Active'>Active</option>
                                <option value='Inactive'>Inactive</option>
                            </Form.Select> 
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button type="submit" style={buttonStyle}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
