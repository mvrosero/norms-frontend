import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';

const EmployeeUpdate = ({ user, handleClose, fetchUsers, headers, roles }) => {
    const [formData, setFormData] = useState({
        employee_idnumber: user.employee_idnumber,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        suffix: user.suffix,
        birthdate: user.birthdate,
        email: user.email,
        password: user.password,
        profile_photo_filename: user.profile_photo_filename,
        role_id: user.role_id,
        status: user.status
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:9000/employee/${user.user_id}`, formData, { headers });
            if (response.status === 200) {
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

    return (
        <form onSubmit={handleSubmit}>
            <Form.Group controlId='employee_idnumber'>
                <Form.Label>Employee ID</Form.Label>
                <Form.Control type='text' name='employee_idnumber' value={formData.employee_idnumber} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId='first_name'>
                <Form.Label>First Name</Form.Label>
                <Form.Control type='text' name='first_name' value={formData.first_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId='middle_name'>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control type='text' name='middle_name' value={formData.middle_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId='last_name'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type='text' name='last_name' value={formData.last_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId='suffix'>
                <Form.Label>Suffix</Form.Label>
                <Form.Control type='text' name='suffix' value={formData.suffix} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId='birthdate'>
                <Form.Label>Birthdate</Form.Label>
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
            <Form.Group controlId='profile_photo_filename'>
                <Form.Label>Photo</Form.Label>
                <Form.Control type='text' name='profile_photo_filename' value={formData.profile_photo_filename} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId='role_id'>
                <Form.Label>Role</Form.Label>
                <Form.Select name='role_id' value={formData.role_id} onChange={handleChange}>
                    <option value=''>Select Role</option>
                    {roles.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                            {role.role_name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group controlId='status'>
                <Form.Label>Status</Form.Label>
                <Form.Control type='status' name='status' value={formData.status} onChange={handleChange} />
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant='primary' type='submit'>
                    Update
                </Button>
            </div>
        </form>
    );
}

export default EmployeeUpdate;
