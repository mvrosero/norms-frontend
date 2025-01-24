import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditStudentModal = ({ user, show, onHide, fetchUsers, headers, departments }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        student_idnumber: user ? user.student_idnumber : '',
        first_name: user ? user.first_name : '',
        middle_name: user ? user.middle_name : '',
        last_name: user ? user.last_name : '',
        suffix: user ? user.suffix : '',
        birthdate: user ? user.birthdate : '',
        email: user ? user.email : '',
        password: user ? user.password : '',
        newPassword: '', 
        confirmPassword: '', 
        year_level: user ? user.year_level : '',
        batch: user ? user.batch : '',
        department_id: user ? user.department_id : '',
        program_id: user ? user.program_id : '',
        status: user ? user.status : 'active',
    });
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [isReset, setIsReset] = useState(false); 
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const [updatedBy, setUpdatedBy] = useState(''); // State to hold the full name or user info

    
        useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        const userId = localStorage.getItem('user_id'); // Extract user ID from localStorage
        
        if (token && roleId === '1') {
            setUpdatedBy(userId); // Directly set userId as the createdBy value
        } else {
            console.error('Token is required for accessing this.');
        }
        }, []);


    // Toggle reset password fields
    const handleResetClick = () => {
        setIsReset(!isReset); 
      };
    

    // Student form data
    useEffect(() => {
        if (formData.department_id) {
            axios
                .get(`https://test-backend-api-2.onrender.com/active-programs/${formData.department_id}`)
                .then((response) => {
                    setFilteredPrograms(response.data); 
                    // If formData.program_id is not set, set it to the user’s program_id
                    if (!formData.program_id && user?.program_id) {
                        setFormData((prevData) => ({
                            ...prevData,
                            program_id: user.program_id, // Set user’s current program as the default
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching programs:', error);
                    setFilteredPrograms([]); 
                });
        }
    }, [formData.department_id, user]);
    

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
                newPassword: '', 
                confirmPassword: '',
                year_level: user.year_level,
                batch: user.batch,
                department_id: user.department_id,
                program_id: user.program_id,
                status: user.status || 'active',
                updatedBy 
            });
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Save the previous status before making changes
        const previousStatus = formData.status;
    
        // Update form data with the new value
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    
        // Validate the field after updating form data
        validateField(name, value);
    
        // Check if the "status" field is being updated to "archived"
        if (name === "status" && value === "archived") {
            Swal.fire({
                title: 'Are you sure you want to archive this user?',
                text: 'Archiving this user will also archive all associated records.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#B0B0B0',
                confirmButtonText: 'Yes, archive it!',
            }).then((result) => {
                if (!result.isConfirmed) {
                    setFormData({ ...formData, status: previousStatus });
                }
            });
        }
    };    


    // Validate the fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'student_idnumber') {
            const idFormat = /^\d{2}-\d{5}$/; 
            if (!idFormat.test(value)) {
                newErrors.student_idnumber = 'Student ID format should be "00-00000".     Note: This action cannot proceed if associated records exist.';
            } else {
                newErrors.student_idnumber = '';
            }
        }

        // Validate First Name
        if (name === 'first_name') {
            const nameFormat = /^[A-Z][a-zA-Z .'-]*$/; 
            if (!nameFormat.test(value)) {
                newErrors.first_name = 'First name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.first_name = '';
            }
        }

        // Validate Middle Name
        if (name === 'middle_name' && value) { 
            const nameFormat = /^[A-Z][a-zA-Z .'-]*$/; 
            if (!nameFormat.test(value)) {
                newErrors.middle_name = 'Middle name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.middle_name = '';
            }
        }

        // Validate Last Name
        if (name === 'last_name') {
            const nameFormat = /^[A-Z][a-zA-Z .'-]*$/; 
            if (!nameFormat.test(value)) {
                newErrors.last_name = 'Last name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.last_name = '';
            }
        }

        // Validate Suffix
        if (name === 'suffix' && value) { 
            const nameFormat = /^[A-Z][a-zA-Z .-]*$/; 
            if (!nameFormat.test(value)) {
                newErrors.suffix = 'Suffix must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.suffix = '';
            }
        }

        // Validate Email
        if (name === 'email') {
            const emailFormat = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/; 
            if (!emailFormat.test(value)) {
                newErrors.email = 'Email must end with "@gbox.ncf.edu.ph".';
            } else {
                newErrors.email = '';
            }
        }

        // Validate New Password Length
        if (name === 'newPassword' && value) {
            if (value.length < 3) {
              newErrors.newPassword = 'New password must be at least 3 characters long.';
            } else {
              newErrors.newPassword = '';
            }
          }

        // Validate Confirm Password Match
        if (name === 'confirmPassword' && value) {

            if (value !== formData.newPassword) {
   
              if (isConfirmPasswordFocused) {
                newErrors.confirmPassword = 'Password does not match the new password.';
              }
            } else {
              newErrors.confirmPassword = '';
            }
          }          
            setErrors(newErrors);
        };


    // Handle submit edit student 
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Form validation for student data
        if (!formData.student_idnumber || !formData.first_name || !formData.last_name || !formData.email || !formData.year_level || !formData.batch || !formData.department_id || !formData.program_id) {
            let missingFields = [];
    
            if (!formData.student_idnumber) missingFields.push("Student ID Number");
            if (!formData.first_name) missingFields.push("First Name");
            if (!formData.last_name) missingFields.push("Last Name");
            if (!formData.email) missingFields.push("Email");
            if (!formData.year_level) missingFields.push("Year Level");
            if (!formData.batch) missingFields.push("Batch");
            if (!formData.department_id) missingFields.push("Department");
            if (!formData.program_id) missingFields.push("Program");
    
            Swal.fire({
                icon: 'error',
                title: 'Missing Required Fields',
                text: `Please fill in the following required fields: ${missingFields.join(", ")}.`,
            });
            return;
        }
    
        // Password validation 
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'The new password and confirm password do not match.',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure you want to save the changes?',
            text: 'You are about to update this student’s details.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, update it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const studentResponse = await axios.put(
                        `https://test-backend-api-2.onrender.com/student/${user.user_id}`,
                        formData,
                        { headers }
                    );
    
                    if (studentResponse.status === 200) {
                        if (formData.newPassword) {
                            const passwordResponse = await axios.put(
                                `https://test-backend-api-2.onrender.com/password-change/${user.user_id}`,
                                { new_password: formData.newPassword, confirm_password: formData.confirmPassword },
                                { headers }
                            );
                            if (passwordResponse.status === 200) {
                                Swal.fire({
                                    icon: 'success',
                                    text: 'Password updated successfully!',
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    text: 'Failed to update password.',
                                });
                            }
                        }
                        Swal.fire({
                            icon: 'success',
                            text: 'Student updated successfully!',
                        }).then(() => {
                            onHide();
                            fetchUsers();
                        });
                    } else {
                        const errorMessage = studentResponse.data.message || 'Failed to update student. Please try again later.';
                        Swal.fire({
                            icon: 'error',
                            text: errorMessage,
                        });
                    }
                } catch (error) {
                    console.error('Error updating student:', error);
                    const errorMessage = error.response?.data?.message || 'An error occurred while updating the student. Please try again later.';
                    Swal.fire({
                        icon: 'error',
                        text: errorMessage,
                    });
                }
            }
        });
    };
    

    // Handle cancel edit student
    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: 'Any unsaved changes will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, close it',
            cancelButtonText: 'No, keep changes',
        }).then((result) => {
            if (result.isConfirmed) {
            setFormData({
                ...formData,
                newPassword: '', 
                confirmPassword: ''  
            });
            setErrors({});  
                onHide(); 
                setIsReset(false);
            }
        });
    };
    
    
    // Generate the batch options from 2018 to 2030
    const batchYears = [];
    for (let year = 2018; year <= 2030; year++) {
        batchYears.push(year);
    }

    // Date and time format
    const formatDateForInput = (date) => {
        const newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset()); 
        return newDate.toISOString().split('T')[0]; 
    };


    // Set styles for fields and buttons
    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da', 
        borderRadius: '4px',
        height: '40px',
        paddingLeft: '10px',
        transition: 'border-color 0.3s ease', 
    };
    
    // Function to dynamically get input styles based on validation errors
    const getInputStyle = (fieldName, formData, errors) => {
        const baseStyle = {
            ...inputStyle,
            borderWidth: '2px', 
        };
            if (errors[fieldName]) {
                return {
                    ...baseStyle,
                    borderColor: 'red', 
                };
            } else if (formData[fieldName]) {
                return {
                    ...baseStyle,
                    borderColor: 'green', 
                };
            }
        return baseStyle; 
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    const cancelButtonStyle = {
        backgroundColor: '#8C8C8C',
        color: '#FFFFFF',
        fontWeight: '900',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    if (!user) {
        return null;
    }


return (
    <Modal show={show} onHide={handleCancel} size="lg" backdrop='static'>
        <Modal.Header>
            <Button variant="link" onClick={handleCancel} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                ×
            </Button>
            <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>EDIT STUDENT DETAILS</Modal.Title>
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
                                style={getInputStyle('student_idnumber', formData, errors)}
                            />
                            {errors.student_idnumber && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.student_idnumber}</div>)}
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
                                style={getInputStyle('first_name', formData, errors)} 
                            />
                            {errors.first_name && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.first_name}</div>)}
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
                                style={getInputStyle('middle_name', formData, errors)} 
                            />
                            {errors.middle_name && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.middle_name}</div>)}
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
                                style={getInputStyle('last_name', formData, errors)} 
                            />
                            {errors.last_name && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.last_name}</div>)}
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
                                style={getInputStyle('suffix', formData, errors)} 
                            />
                            {errors.suffix && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.suffix}</div>)}
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
                                <option value="">Select Department</option>
                                    {departments.filter(department => department.status === 'active').map(department => (
                                <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
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
                                style={getInputStyle('email', formData, errors)} 
                            />
                            {errors.email && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>)}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="password">
                        <Form.Label className="fw-bold">Password</Form.Label>
                        <div style={{ position: 'relative' }}>
                        <Form.Control
                            type="password" 
                            name="password"
                            value={ formData.password ? formData.password.padEnd(10, '•').slice(0, 10) : '••••••••••' }
                            onChange={handleChange}
                            readOnly 
                            style={{ ...getInputStyle('password', formData, errors), paddingRight: '40px' }}
                            placeholder="Enter Password"
                            required
                        />
                        <Button variant="link" style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', textDecoration: 'none', fontWeight: '600', color: '#4e4e4e' }}
                            onClick={handleResetClick} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                            Reset
                        </Button>
                        </div>
                        {errors.password && ( <div style={{ color: 'red', fontSize: '12px' }}>{errors.password}</div>)}

                    {/* Render additional fields for new password and confirm password when reset is clicked */}
                    {isReset && (
                    <>
                    <Form.Group controlId="newPassword">
                        <Form.Label className="fw-bold" style={{ marginTop: "10px" }}>New Password</Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={formData.newPassword || ""}
                                onChange={handleChange}
                                placeholder="Enter New Password"
                                style={{...getInputStyle("newPassword", formData, errors), paddingRight: "40px" }}
                                required
                                />
                                {errors.newPassword && (<div style={{ color: "red", fontSize: "12px" }}>{errors.newPassword}</div>)}
                        </div>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label className="fw-bold" style={{ marginTop: "10px" }}> Confirm Password </Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword || ""}
                                onChange={handleChange}
                                placeholder="Confirm New Password"
                                style={{...getInputStyle("confirmPassword", formData, errors), paddingRight: "40px" }}
                                required
                                onFocus={() => setIsConfirmPasswordFocused(true)} 
                                onBlur={() => setIsConfirmPasswordFocused(false)} 
                                />
                                {isConfirmPasswordFocused && errors.confirmPassword && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.confirmPassword}</div>)}
                        </div>
                        </Form.Group>
                        </>
                        )}
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

                <div className="input-group" style={{ display: 'none' }}>
                    <label htmlFor="updatedBy" className="label">Updated By:</label>
                    <input
                        id="updatedBy"
                        name="updatedBy"
                        type="text"
                        value={updatedBy} 
                        readOnly
                    />
                </div>
            </Row>
            
            {/* Buttons */}
            <div className="d-flex justify-content-end mt-3">
                <button type="button" onClick={handleCancel} style={cancelButtonStyle}>
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