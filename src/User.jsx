import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

import "./User.css";

const User = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [show, setShow] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        student_idnumber: '',
        fullname: '',
        birthdate: '',
        email: '',
        password: '',
        year_level: '',
        profile_photo_filename: '',
        department_id: '',
        program_id: '',
        role_id: ''
    });

    const user = JSON.parse(localStorage.getItem('token'));
    
    const headers = useMemo(() => {
        if (user && user.data && user.data.token) {
            return {
                accept: 'application/json',
                Authorization: user.data.token
            };
        } else {
            return {};
        }
    }, [user]);

    const fetchUsers = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:3001/students', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [headers]); 

    const fetchRoles = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:3001/roles', { headers });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }, [headers]); 

    const fetchDepartments = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:3001/departments', { headers });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, [headers]); 

    const fetchPrograms = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:3001/programs', { headers });
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    }, [headers]); 

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchDepartments();
        fetchPrograms();
    }, [fetchUsers]); 

    const handleClose = () => setShow(false);

    const handleShow = (user) => {
        setSelectedUser(user);
        if (user) {
            setFormData({
                student_idnumber: user.student_idnumber,
                fullname: user.fullname,
                birthdate: user.birthdate,
                email: user.email,
                password: user.password,
                year_level: user.year_level,
                profile_photo_filename: user.profile_photo_filename,
                department_id: user.department_id,
                program_id: user.program_id,
                role_id: user.role_id
            });
        } else {
            setFormData({
                student_idnumber: '',
                fullname: '',
                birthdate: '',
                email: '',
                password: '',
                year_level: '',
                profile_photo_filename: '',
                department_id: '',
                program_id: '',
                role_id: ''
            });
        }
        setShow(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/registerStudents', formData, { headers });
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    text: 'User created successfully!',
                });
                handleClose();
                fetchUsers();
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to create user. Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while creating user. Please try again later.',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:3001/user/${selectedUser.id}`, formData, { headers });
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    text: 'User updated successfully!',
                });
                handleClose();
                fetchUsers();
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to update user. Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while updating user. Please try again later.',
            });
        }
    };

    const deleteUser = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });
        if (!isConfirm) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/user/${id}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };

    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };

    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.role_id === roleId);
        return role ? role.role_name : '';
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) =>d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find((p) => p.program_id === programId);
        return program ? program.program_name : '';
    };

    return (
        <>
            <div className='container'>
            <h1 className="students-title">Students</h1>
                <br />
                <div className='col-12'>
                    <Button variant='secondary mb-2 float-end btn-sm me-2' onClick={() => handleShow(null)}>
                        Add Students
                    </Button>
                </div>

                <Table striped bordered hover style={{ borderRadius: '20px' }}>
                    <thead>
                        <tr>
                            <th>idnumber</th>
                            <th>fullname</th>
                            <th>email</th>
                            <th>Birthdate</th>
                            <th>year_level</th>
                            <th>department</th>
                            <th>program</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.student_idnumber}</td>
                                <td>{user.fullname}</td>
                                <td>{user.email}</td>
                                <td>{user.birthdate}</td>
                                <td>{user.year_level}</td>
                                <td>{getDepartmentName(user.department_id)}</td>
                                <td>{getProgramName(user.program_id)}</td>
                                <td>{getRoleName(user.role_id)}</td>
                                <td>
                                    <div className="float-end">
                                        <Button className='btn btn-danger btn-md' onClick={() => deleteUser(user.id)}>
                                            <DeleteIcon />
                                        </Button>
                                        <Button className='btn btn-success btn-md ms-2' onClick={() => handleShow(user)}>
                                            <EditIcon />
                                        </Button>
                                        <Button className='btn btn-secondary btn-md ms-2' onClick={() => handleReadModalShow(user)}>
                                            <PermIdentityIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? 'Update User' : 'Create User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={selectedUser ? handleSubmit : handleCreateSubmit}>
                        <Form.Group controlId='student_idnumber'>
                            <Form.Label>student_idnumber</Form.Label>
                            <Form.Control type='text' name='student_idnumber' value={formData.student_idnumber} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId='fullname'>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type='text' name='fullname' value={formData.fullname} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId='birthdate'>
                            <Form.Label>birthdate</Form.Label>
                            <Form.Control type='text' name='birthdate' value={formData.birthdate} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='text' name='email' value={formData.email} onChange={handleChange} />
                        </Form.Group>
                       <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name='password' value={formData.password} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId='year_level'>
                            <Form.Label>year_level</Form.Label>
                            <Form.Control type='text' name='year_level' value={formData.year_level} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId='profile_photo_filename'>
                            <Form.Label>photo</Form.Label>
                            <Form.Control type='text' name='profile_photo_filename' value={formData.profile_photo_filename} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId='department_id'>
                            <Form.Label>Select Department</Form.Label>
                            <Form.Select name='department_id' value={formData.department_id} onChange={handleChange} style={{ width: '200px' }}>
                                <option value=''>Select Program</option>
                                {departments.map((department) => (
                                    <option key={department.department_id} value={department.department_id}>
                                        {department.department_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId='program_id'>
                            <Form.Label>Select Program</Form.Label>
                            <Form.Select name='program_id' value={formData.program_id} onChange={handleChange} style={{ width: '200px' }}>
                                <option value=''>Select Program</option>
                                {programs.map((program) => (
                                    <option key={program.program_id} value={program.program_id}>
                                        {program.program_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId='role_id'>
                            <Form.Label>Role ID</Form.Label>
                            <Form.Select name='role_id' value={formData.role_id} onChange={handleChange} style={{ width: '200px' }}>
                                <option value=''>Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.role_id} value={role.role_id}>
                                        {role.role_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant='primary' type='submit'>
                                {selectedUser ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showReadModal} onHide={handleReadModalClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Read-Only Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p><strong>Student iD:</strong> {selectedUser.student_idnumber}</p>
                            <p><strong>Name:</strong> {selectedUser.fullname}</p>
                            <p><strong>birthdate:</strong> {selectedUser.birthdate}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>department:</strong> {getDepartmentName(selectedUser.department_id)}</p>
                            <p><strong>program:</strong> {getProgramName(selectedUser.program_id)}</p>
                            <p><strong>role:</strong> {getRoleName(selectedUser.role_id)}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default User;