import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js'; // Import fuse.js for search functionality
import "../administrator/Students.css";

const ManageDepartments = ({ searchQuery }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [departmentFormData, setDepartmentFormData] = useState({
        department_code: '',
        department_name: '',
        status: '',
    });
    const [deletionStatus, setDeletionStatus] = useState(false);
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setLoading(false);
        }
    }, [headers]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

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
            const response = await axios.post('http://localhost:9000/register-department', departmentFormData, { headers });
            Swal.fire({
                icon: 'success',
                title: 'Department Added Successfully!',
                text: 'The new department has been added successfully.',
            });
            handleCloseDepartmentModal();
            fetchDepartments(); // Re-fetch departments to include the new one
        } catch (error) {
            console.error('Error adding department:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the department. Please try again later!',
            });
        }
    };

    const handleEditDepartment = async (departmentId) => {
        console.log('Edit department with id:', departmentId);
        // Implement the edit logic here
    };

    const deleteDepartment = async (departmentId) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then(result => result.isConfirmed);
        
        if (!isConfirm) return;
    
        try {
            await axios.delete(`http://localhost:9000/departments/${departmentId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            setDeletionStatus(prevStatus => !prevStatus); // Toggle deletionStatus to trigger re-fetch
            setDepartments(prevDepartments => prevDepartments.filter(department => department.department_id !== departmentId));
        } catch (error) {
            console.error('Error deleting department:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while deleting the department. Please try again later!',
            });
        }
    };

    return (
        <>
            <div className='container'>
                <br />
                <div className='col-12'>
                    {/* Add a search bar or filter here if needed */}
                </div>

                {/* Departments table */}
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>Department Code</th>
                            <th>Department Name</th>
                            <th style={{ width: '10%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{department.department_id}</td>
                                <td>{department.department_code}</td>
                                <td>{department.department_name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{
                                        backgroundColor: department.status === 'Active' ? '#DBF0DC' : '#F0DBDB',
                                        color: department.status === 'Active' ? '#30A530' : '#D9534F',
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
                                            backgroundColor: department.status === 'Active' ? '#30A530' : '#D9534F',
                                            marginRight: '7px',
                                        }} />
                                        {department.status}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Button className='btn btn-secondary btn-md ms-2' onClick={() => handleEditDepartment(department.department_id)}>
                                            <EditIcon />
                                        </Button>
                                        <Button className='btn btn-danger btn-md ms-2' onClick={() => deleteDepartment(department.department_id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

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
                                    style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da', borderRadius: '.25rem', height: '40px', width: '100%' }} 
                                />
                            </Form.Group>
                            <Form.Group controlId='department_name'>
                                <Form.Label className="fw-bold">Department Name</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    name='department_name' 
                                    value={departmentFormData.department_name} 
                                    onChange={handleDepartmentChange} 
                                    style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da', borderRadius: '.25rem', height: '40px', width: '100%' }} 
                                />
                            </Form.Group>
                            <Form.Group controlId='status'>
                                <Form.Label className="fw-bold">Status</Form.Label>
                                <Form.Select 
                                    name='status' 
                                    value={departmentFormData.status} 
                                    onChange={handleDepartmentChange} 
                                    style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da', borderRadius: '.25rem', height: '40px', width: '100%' }}
                                >
                                    <option value=''>Select Status</option>
                                    <option value='Active'>Active</option>
                                    <option value='Inactive'>Inactive</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="d-flex justify-content-end mt-3">
                                <Button type="submit" style={{ backgroundColor: '#28a745', color: 'white', fontWeight: '600', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default ManageDepartments;
