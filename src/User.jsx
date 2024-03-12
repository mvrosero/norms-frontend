import React, { useState, useEffect,useCallback,useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

import "./App.css"
const User = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [show, setShow] = useState(false);
    const [showReadModal, setShowReadModal] = useState(false); // New state for the read-only modal
   
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        user_number: '',
        username: '',
        email: '',
        password: '',
        role_id: '',
    });

    const user = JSON.parse(localStorage.getItem('token'));
    

    const headers = useMemo(() => ({
        accept: 'application/json',
        Authorization: user.data.token
    }), [user.data.token]);
    const fetchUsers = useCallback(async () => {  // Wrap the definition of fetchUsers in useCallback
        try {
            const response = await axios.get('https://test-backend-api-z3sd.onrender.com/users', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [headers]); // Add headers as a dependency to useCallback

    const fetchRoles = useCallback(async () => {  // Wrap the definition of fetchUsers in useCallback
        try {
            const response = await axios.get('https://test-backend-api-z3sd.onrender.com/roles', { headers });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [headers]); // Add headers as a dependency to useCallback


   
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers]); // Use fetchUsers as a dependency in useEffect

    const handleClose = () => setShow(false);

    const handleShow = (user) => {
        setSelectedUser(user);
        if (user) {
            setFormData({
                name: user.name,
                user_number: user.user_number,
                username: user.username,
                email: user.email,
                password: user.password,
                role_id: user.role_id,
            });
        } else {
            setFormData({
                name: '',
                user_number: '',
                username: '',
                email: '',
                password: '',
                role_id: '',
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
            await axios.post('https://test-backend-api-z3sd.onrender.com/register', formData, { headers });
            Swal.fire({
                icon: 'success',
                text: 'User created successfully!',
            });
            handleClose();
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while creating user.',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`https://test-backend-api-z3sd.onrender.com/user/${selectedUser.id}`, formData, { headers });
            Swal.fire({
                icon: 'success',
                text: 'User updated successfully!',
            });
            handleClose();
            fetchUsers();
           
         
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while updating user.',
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

        await axios.delete(`https://test-backend-api-z3sd.onrender.com/user/${id}`, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            fetchUsers();
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            });
        });
    };
    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };

    return (
        <>
        
    <div className='container'>
        <br />
        <div className='col-12'>
            <Button variant='btn btn-success mb-2 float-end btn-sm me-2' onClick={() => handleShow(null)}>
                Add User
            </Button>
        </div>
        <Table striped bordered hover  style={{ borderradius:'20px' }}>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Name</th>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 &&
                    users.slice(0, 10).map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.user_number}</td>
                            <td>{user.email}</td>
                            <td>{user.role_name}</td>
                            <td>
                                <Button className='btn btn-danger btn-md' onClick={() => deleteUser(user.id)}>
                                <DeleteIcon/>
                                </Button>
                                <Button className='btn btn-success btn-md ms-2' onClick={() => handleShow(user)}>
                                 <EditIcon/>
                                </Button>
                                <Button className='btn btn-secondary btn-md ms-2' onClick={() => handleReadModalShow(user)}>
                                  <PermIdentityIcon/>
                                </Button>
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
            <Form onSubmit={selectedUser ? handleSubmit : handleCreateSubmit} >
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' name='name' value={formData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId='user_umber'>
                    <Form.Label>User ID</Form.Label>
                    <Form.Control type='text' name='user_number' value={formData.user_number} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='text' name='username' value={formData.username} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='text' name='email' value={formData.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' name='password'   value={formData.password} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId='role_id'>
    <Form.Label>Role ID</Form.Label>
    <Form.Select 
        name='role_id' 
        value={formData.role_id} 
        onChange={handleChange}
        style={{ width: '200px' }} // Adjust the width according to your preference
    >
        <option value=''>Select Role</option>
        {roles.map((role) => (
            <option key={role.role_id} value={role.role_id}>
                {role.role_name}
            </option>
        ))}
    </Form.Select>
</Form.Group>
<div className="d-flex justify-content-end"> {/* Add this div with flex utilities */}
                <Button variant='primary' type='submit'>
                    {selectedUser ? 'Update User' : 'Create User'}
                </Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>

    {/* Read-only modal */}
    <Modal show={showReadModal} onHide={handleReadModalClose}  dialogClassName="modal-90w">
        <Modal.Header closeButton>
            <Modal.Title>Read-Only Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedUser && (
                <div>
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>User ID:</strong> {selectedUser.user_number}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Email:</strong> {selectedUser.username}</p>
                    <p><strong>Role:</strong> {selectedUser.role_name}</p>
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleReadModalClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
</>

    );
};



export default User;