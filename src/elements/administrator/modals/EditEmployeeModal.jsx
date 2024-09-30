import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Row, Col } from 'react-bootstrap';

const EditEmployeeModal = ({ user, handleClose, fetchUsers, headers, roles }) => {
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

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px'
    };

    const buttonStyle = {
        backgroundColor: '#3B71CA',
        color: 'white',
        fontWeight: '900',
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
        <form onSubmit={handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group controlId='employee_idnumber'>
                        <Form.Label className="fw-bold">Employee ID</Form.Label>
                        <Form.Control type='text' name='employee_idnumber' value={formData.employee_idnumber} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                    <Form.Group controlId='first_name'>
                        <Form.Label className="fw-bold">First Name</Form.Label>
                        <Form.Control type='text' name='first_name' value={formData.first_name} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                    <Form.Group controlId='middle_name'>
                        <Form.Label className="fw-bold"> Middle Name</Form.Label>
                        <Form.Control type='text' name='middle_name' value={formData.middle_name} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                    <Form.Group controlId='last_name'>
                        <Form.Label className="fw-bold">Last Name</Form.Label>
                        <Form.Control type='text' name='last_name' value={formData.last_name} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                    <Form.Group controlId='suffix'>
                        <Form.Label className="fw-bold">Suffix</Form.Label>
                        <Form.Control type='text' name='suffix' value={formData.suffix} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId='email'>
                        <Form.Label className="fw-bold">Email</Form.Label>
                        <Form.Control type='text' name='email' value={formData.email} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label className="fw-bold">Password</Form.Label>
                        <Form.Control type='password' name='password' value={formData.password} onChange={handleChange} style={inputStyle} />
                    </Form.Group>
                    <Form.Group controlId='role_id'>
                        <Form.Label className="fw-bold">Role</Form.Label>
                        <Form.Select name='role_id' value={formData.role_id} onChange={handleChange} style={inputStyle}>
                            <option value=''>Select Role</option>
                            {roles.filter(role => role.role_name.toLowerCase() !== 'student').map((role) => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId='status'>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select name='status' value={formData.status} onChange={handleChange} style={inputStyle}>
                            <option value=''>Select Status</option>
                            <option value='active'>Active</option>
                            <option value='inactive'>Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
                <button type="submit" style={buttonStyle}>
                    Update
                </button>
            </div>
        </form>
    );
}

export default EditEmployeeModal;
