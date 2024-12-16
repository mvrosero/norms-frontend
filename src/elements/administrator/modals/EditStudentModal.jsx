import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditStudentModal = ({ user, show, onHide, fetchUsers, headers, departments }) => {
    const [formData, setFormData] = useState({
        student_idnumber: user ? user.student_idnumber : '',
        first_name: user ? user.first_name : '',
        middle_name: user ? user.middle_name : '',
        last_name: user ? user.last_name : '',
        suffix: user ? user.suffix : '',
        birthdate: user ? user.birthdate : '',
        email: user ? user.email : '',
        password: user ? user.password : '',
        year_level: user ? user.year_level : '',
        batch: user ? user.batch : '',
        department_id: user ? user.department_id : '',
        program_id: user ? user.program_id : '',
        status: user ? user.status : 'active',
    });

    const [filteredPrograms, setFilteredPrograms] = useState([]);
    
    useEffect(() => {
        if (formData.department_id) {
            // Fetch programs based on selected department_id
            axios
                .get(`http://localhost:9000/programs/${formData.department_id}`)
                .then((response) => {
                    setFilteredPrograms(response.data); // Set the filtered programs
                })
                .catch((error) => {
                    console.error('Error fetching programs:', error);
                    setFilteredPrograms([]); // Reset programs on error
                });
        }
    }, [formData.department_id]);

    useEffect(() => {
        if (user) {
            setFormData({
                student_idnumber: user.student_idnumber,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                suffix: user.suffix,
                birthdate: user.birthdate,
                email: user.email,
                password: user.password,
                year_level: user.year_level,
                batch: user.batch,
                department_id: user.department_id,
                program_id: user.program_id,
                status: user.status || 'active',
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

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Validate student_idnumber format (should follow "00-00000")
        const idFormat = /^\d{2}-\d{5}$/; // Matches "00-00000" format
        if (!idFormat.test(formData.student_idnumber)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid student ID number format',
                text: 'It should follow the format "00-00000".',
            });
            return;
        }
    
        // Validate names to start with a capital letter and allow letters, spaces, dashes, and dots
        const nameFormat = /^[A-Z][a-zA-Z .-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
        if (!nameFormat.test(formData.first_name)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid First Name',
                text: 'First name must start with a capital letter and can contain only letters, spaces, dots, or dashes.',
            });
            return;
        }
        if (formData.middle_name && !nameFormat.test(formData.middle_name)) { // Middle name is optional
            Swal.fire({
                icon: 'error',
                title: 'Invalid Middle Name',
                text: 'Middle name must start with a capital letter and can contain only letters, spaces, dots, or dashes.',
            });
            return;
        }
        if (!nameFormat.test(formData.last_name)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Last Name',
                text: 'Last name must start with a capital letter and can contain only letters, spaces, dots, or dashes.',
            });
            return;
        }
        if (formData.suffix && !nameFormat.test(formData.suffix)) { // Suffix is optional
            Swal.fire({
                icon: 'error',
                title: 'Invalid Suffix',
                text: 'Suffix must start with a capital letter and can contain only letters, spaces, dots, or dashes.',
            });
            return;
        }
    
        // Validate email to end with "@gbox.ncf.edu.ph"
        const emailFormat = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/;
        if (!emailFormat.test(formData.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Email must end with "@gbox.ncf.edu.ph".',
            });
            return;
        }
    
        // Validate password length
        if (formData.password && formData.password.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: 'Password must be at least 3 characters long.',
            });
            return;
        }
    
        // If all validations pass, proceed with form submission
        // Add your form submission logic here, for example:
        try {
            // Simulate a successful submission (e.g., API call or form submission)
            Swal.fire({
                icon: 'success',
                title: 'Form Submitted',
                text: 'Student details have been successfully updated.',
            });
            // You can proceed with sending data to your backend here
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an issue submitting the form.',
            });
        }
    
    
    
     // Basic form validation
if (!formData.student_idnumber || !formData.first_name || !formData.last_name || !formData.email || !formData.year_level || !formData.batch || !formData.department_id || !formData.program_id) {
    let missingFields = [];

    // Identify missing fields
    if (!formData.student_idnumber) missingFields.push("Student ID Number");
    if (!formData.first_name) missingFields.push("First Name");
    if (!formData.last_name) missingFields.push("Last Name");
    if (!formData.email) missingFields.push("Email");
    if (!formData.year_level) missingFields.push("Year Level");
    if (!formData.batch) missingFields.push("Batch");
    if (!formData.department_id) missingFields.push("Department");
    if (!formData.program_id) missingFields.push("Program");

    // Create a more informative message
    Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: `Please fill in the following required fields: ${missingFields.join(", ")}.`,
    });
    return;
}

        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to update this student’s details.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
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
                        }).then(() => {
                            onHide();
                            fetchUsers();
                        });
                    } else {
                        const errorMessage = response.data.message || 'Failed to update user. Please try again later.';
                        Swal.fire({
                            icon: 'error',
                            text: errorMessage,
                        });
                    }
                } catch (error) {
                    console.error('Error updating user:', error);
                    const errorMessage = error.response?.data?.message || 'An error occurred while updating the user. Please try again later.';
                    Swal.fire({
                        icon: 'error',
                        text: errorMessage,
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

    // Generate the batch options from 2018 to 2030
    const batchYears = [];
    for (let year = 2018; year <= 2030; year++) {
        batchYears.push(year);
    }

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
                        marginLeft: '120px',
                        marginRight: '120px',
                    }}
                >
                    EDIT STUDENT DETAILS
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            <form onSubmit={handleSubmit}>
            <div>
            <h5 
                className="fw-bold" style={{ fontSize: '18px', color: '#0D4809', marginTop: '10px', marginBottom: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                Personal Information
            </h5>
            </div>
            <Row className="gy-4">
                <Col md={6}>
                    <Form.Group controlId="student_idnumber">
                        <Form.Label className="fw-bold">Student ID Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="student_idnumber"
                            value={formData.student_idnumber}
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
                        Academic Information
                    </h5>
                </div>

                {/* Year Level, Batch, Department, and Program */}
                <Col md={6}>
                    <Form.Group controlId="year_level">
                        <Form.Label className="fw-bold">Year Level</Form.Label>
                        <Form.Select
                            name="year_level"
                            value={formData.year_level}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="First Year">First Year</option>
                            <option value="Second Year">Second Year</option>
                            <option value="Third Year">Third Year</option>
                            <option value="Fourth Year">Fourth Year</option>
                            <option value="Fifth Year">Fifth Year</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="batch">
                        <Form.Label className="fw-bold">Batch</Form.Label>
                        <Form.Select
                            name="batch"
                            value={formData.batch || ''}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            {batchYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                            <Form.Group controlId="department_id">
                                <Form.Label className="fw-bold">Department</Form.Label>
                                <Form.Select
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    {departments.map((department) => (
                                        <option key={department.department_id} value={department.department_id}>
                                            {department.department_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="program_id">
                                <Form.Label className="fw-bold">Program</Form.Label>
                                <Form.Select
                                    name="program_id"
                                    value={formData.program_id}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">Select Program</option>
                                    {filteredPrograms.map((program) => (
                                        <option key={program.program_id} value={program.program_id}>
                                            {program.program_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>


                <div>
                    <h5 
                        className="fw-bold" style={{ fontSize: '18px', color: '#0D4809', marginTop: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                        Account Information
                    </h5>
                </div>

                {/* Email Address, Passowrd, and Status Section */}
                <Col md={6}>
                    <Form.Group controlId="email">
                        <Form.Label className="fw-bold">Email Address</Form.Label>
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
                <Col md={6}>
                    <Form.Group controlId="status" style={{ marginBottom: '30px' }}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
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


export default EditStudentModal;