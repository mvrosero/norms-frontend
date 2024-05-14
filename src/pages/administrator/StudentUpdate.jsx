import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';

const StudentUpdate = ({ user, handleClose, fetchUsers, headers, departments, programs }) => {
    const [formData, setFormData] = useState({
        student_idnumber: user.student_idnumber,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        suffix: user.suffix,
        birthdate: user.birthdate,
        email: user.email,
        password: user.password,
        profile_photo_filename: user.profile_photo_filename,
        department_id: user.department_id,
        program_id: user.program_id,
        role_id: user.role_id,
        year_level: user.year_level,
        status: user.status
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:9000/student/${user.user_id}`, formData, { headers });
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
            <Row>
                <Col md={3}>
                    <Form.Group controlId='student_idnumber'>
                        <Form.Label className="fw-bold">Student ID Number</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='first_name'>
                        <Form.Label className="fw-bold">First Name</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='middle_name'>
                        <Form.Label className="fw-bold">Middle Name</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='last_name'>
                        <Form.Label className="fw-bold">Last Name</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='suffix'>
                        <Form.Label className="fw-bold">Suffix</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label className="fw-bold">Email</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label className="fw-bold">Password</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='year_level'>
                        <Form.Label className="fw-bold">Year Level</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='department_id'>
                        <Form.Label className="fw-bold">Select Department</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='program_id'>
                        <Form.Label className="fw-bold">Select Program</Form.Label>
                    </Form.Group>
                    <Form.Group controlId='status'>
                        <Form.Label className="fw-bold">Status</Form.Label>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId='student_idnumber'>
                        <Form.Control type='text' name='student_idnumber' value={formData.student_idnumber} onChange={handleChange} className="bg-gray" style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da', borderRadius: '.25rem' }}  />
                    </Form.Group>
                    <Form.Group controlId='first_name'>
                        <Form.Control type='text' name='first_name' value={formData.first_name} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='middle_name'>
                        <Form.Control type='text' name='middle_name' value={formData.middle_name} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='last_name'>
                        <Form.Control type='text' name='last_name' value={formData.last_name} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='suffix'>
                        <Form.Control type='text' name='suffix' value={formData.suffix} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Control type='text' name='email' value={formData.email} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Control type='password' name='password' value={formData.password} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='year_level'>
                        <Form.Control type='text' name='year_level' value={formData.year_level} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                    <Form.Group controlId='department_id'>
                        <Form.Control as="select" name='department_id' value={formData.department_id} onChange={handleChange} className="bg-gray" style={{ width: '200px' }}>
                            <option value=''>Select Department</option>
                            {departments.map((department) => (
                                <option key={department.department_id} value={department.department_id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='program_id'>
                        <Form.Control as="select" name='program_id' value={formData.program_id} onChange={handleChange} className="bg-gray" style={{ width: '200px' }}>
                            <option value=''>Select Program</option>
                            {programs.map((program) => (
                                <option key={program.program_id} value={program.program_id}>
                                    {program.program_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='status'>
                        <Form.Control type='text' name='status' value={formData.status} onChange={handleChange} className="bg-gray" />
                    </Form.Group>
                </Col>
            </Row>
            <div className="d-flex justify-content-end">
                <Button variant='primary' type='submit'>
                    Update
                </Button>
            </div>
        </form>
    );
}

export default StudentUpdate;
