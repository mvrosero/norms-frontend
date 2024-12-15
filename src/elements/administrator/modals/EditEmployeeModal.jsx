import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditEmployeeModal = ({ user, show, onHide, fetchUsers, headers, roles }) => {
    const [formData, setFormData] = useState({
        employee_idnumber: user ? user.employee_idnumber : '',
        first_name: user ? user.first_name : '',
        middle_name: user ? user.middle_name : '',
        last_name: user ? user.last_name : '',
        suffix: user ? user.suffix : '',
        birthdate: user ? user.birthdate : '',
        email: user ? user.email : '',
        password: user ? user.password : '',
        profile_photo_filename: user ? user.profile_photo_filename : '',
        role_id: user ? user.role_id : '',
        status: user ? user.status : 'active', // Default to 'active' if user is null
    });

    useEffect(() => {
        if (user) {
            setFormData({
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
                status: user.status || 'active', // Default to 'active'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to update this employee’s details.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(
                        `http://localhost:9000/employee/${user.user_id}`,
                        formData,
                        { headers }
                    );
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            text: 'User updated successfully!',
                        }).then(() => {
                            onHide();
                            fetchUsers();
                        });
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
                        text: 'An error occurred while updating the user. Please try again later.',
                    });
                }
            }
        });
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Any unsaved changes will be lost. Do you want to close without saving?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, close it!',
        }).then((result) => {
            if (result.isConfirmed) {
                onHide(); // This will execute when the user confirms the cancel action
            }
        });
    };


    const formatDateForInput = (date) => {
        const newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset()); // Adjust for time zone offset
        return newDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
      };
    

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        paddingLeft: '10px'
    };

    const buttonStyle = {
        backgroundColor: '#3B71CA',
        color: '#FFFFFF',
        fontWeight: '900',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const cancelButtonStyle = {
        backgroundColor: '#8C8C8C',
        color: '#FFFFFF',
        fontWeight: '900',
        padding: '12px 25px',
        border: '1px solid #ced4da',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    };

    if (!user) {
        return null;
    }

    return (
        <Modal show={show} onHide={handleCancel} size="lg">
            <Modal.Header>
                <Button
                    variant="link"
                    onClick={handleCancel}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '20px',
                        textDecoration: 'none',
                        fontSize: '30px',
                        color: '#a9a9a9',
                    }}
                >
                    ×
                </Button>
                <Modal.Title
                    style={{
                        fontSize: '40px',
                        marginBottom: '10px',
                        marginLeft: '100px',
                        marginRight: '100px',
                    }}
                >
                    EDIT EMPLOYEE DETAILS
                </Modal.Title>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <form onSubmit={handleSubmit}>
                <div>
                    <h5 
                        className="fw-bold" style={{ fontSize: '18px', color: '#0D4809', marginTop: '10px', marginBottom: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                        Personal Information
                    </h5>
                </div>
                    <Row className="gy-4">
                        {/* Employee ID and Birthdate */}
                        <Col md={6}>
                            <Form.Group controlId="employee_idnumber">
                                <Form.Label className="fw-bold">Employee ID Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employee_idnumber"
                                    value={formData.employee_idnumber}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                        <Form.Group controlId="birthdate">
                            <Form.Label className="fw-bold">Birthdate</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthdate"
                                value={formData.birthdate ? formatDateForInput(formData.birthdate) : ''}
                                onChange={handleChange}
                                placeholder={formData.birthdate ? '' : 'MM/DD/YYYY'}
                                style={inputStyle}
                            />
                        </Form.Group>
                        </Col>

                        {/* First Name and Middle Name */}
                        <Col md={6}>
                            <Form.Group controlId="first_name">
                                <Form.Label className="fw-bold">First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="middle_name">
                                <Form.Label className="fw-bold">Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>

                        {/* Last Name and Suffix */}
                        <Col md={6}>
                            <Form.Group controlId="last_name">
                                <Form.Label className="fw-bold">Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="suffix">
                                <Form.Label className="fw-bold">Suffix</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="suffix"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>

                        <div>
                            <h5 
                                className="fw-bold" style={{ fontSize: '18px', color: '#0D4809', marginTop: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                                Account Information
                            </h5>
                        </div>
            
                        {/* Email Address and Password */}
                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label className="fw-bold">Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="password">
                                <Form.Label className="fw-bold">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </Form.Group>
                        </Col>

                        {/* Role and Status */}
                        <Col md={6}>
                            <Form.Group controlId="role_id" style={{ marginBottom: '30px' }}>
                                <Form.Label className="fw-bold">Role</Form.Label>
                                <Form.Select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    {roles
                                        .filter((role) => role.role_name.toLowerCase() !== 'student')
                                        .map((role) => (
                                            <option key={role.role_id} value={role.role_id}>
                                                {role.role_name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="status">
                                <Form.Label className="fw-bold">Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end mt-3">
                       <button
                            type="button"
                            onClick={handleCancel} // Trigger the handleCancel function
                            style={cancelButtonStyle} // Apply the styles
                        >
                            Cancel
                        </button>
                        <button type="submit" style={buttonStyle}>
                            Update
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditEmployeeModal;
