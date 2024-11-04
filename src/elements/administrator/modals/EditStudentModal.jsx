import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Row, Col } from 'react-bootstrap';

const EditStudentModal = ({ user, handleClose, fetchUsers, headers, departments, programs }) => {
    const [formData, setFormData] = useState({
        student_idnumber: user.student_idnumber,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        suffix: user.suffix,
        email: user.email,
        password: user.password,
        year_level: user.year_level,
        batch: user.batch, // Added batch
        department_id: user.department_id,
        program_id: user.program_id,
        status: user.status || 'active', // Default to 'active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', formData); // Debugging to confirm correct data
        try {
            const response = await axios.put(
                `http://localhost:9000/student/${user.user_id}`,
                formData,
                { headers }
            );
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
        height: '40px',
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group controlId='student_idnumber'>
                        <Form.Label className="fw-bold">Student ID Number</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='student_idnumber' 
                            value={formData.student_idnumber} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='first_name'>
                        <Form.Label className="fw-bold">First Name</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='first_name' 
                            value={formData.first_name} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='middle_name'>
                        <Form.Label className="fw-bold">Middle Name</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='middle_name' 
                            value={formData.middle_name} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='last_name'>
                        <Form.Label className="fw-bold">Last Name</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='last_name' 
                            value={formData.last_name} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='suffix'>
                        <Form.Label className="fw-bold">Suffix</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='suffix' 
                            value={formData.suffix} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId='email'>
                        <Form.Label className="fw-bold">Email</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='email' 
                            value={formData.email} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label className="fw-bold">Password</Form.Label>
                        <Form.Control 
                            type='password' 
                            name='password' 
                            value={formData.password} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='year_level'>
                        <Form.Label className="fw-bold">Year Level</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='year_level' 
                            value={formData.year_level} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='batch'>
                        <Form.Label className="fw-bold">Batch</Form.Label>
                        <Form.Control 
                            type='text' 
                            name='batch' 
                            value={formData.batch} 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </Form.Group>
                    <Form.Group controlId='department_id'>
                        <Form.Label className="fw-bold">Department</Form.Label>
                        <Form.Select 
                            name='department_id' 
                            value={formData.department_id} 
                            onChange={handleChange} 
                            style={inputStyle}
                        >
                            <option value=''>Select Department</option>
                            {departments.map((department) => (
                                <option key={department.department_id} value={department.department_id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId='program_id'>
                        <Form.Label className="fw-bold">Program</Form.Label>
                        <Form.Select 
                            name='program_id' 
                            value={formData.program_id} 
                            onChange={handleChange} 
                            style={inputStyle}
                        >
                            <option value=''>Select Program</option>
                            {programs.map((program) => (
                                <option key={program.program_id} value={program.program_id}>
                                    {program.program_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId='status'>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select 
                            name='status' 
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
            <div className="d-flex justify-content-end mt-3">
                <button type="submit" style={buttonStyle}>
                    Update
                </button>
            </div>
        </Form>
    );
};

export default EditStudentModal;
