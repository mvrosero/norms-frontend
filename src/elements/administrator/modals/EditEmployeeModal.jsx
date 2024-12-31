import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const EditEmployeeModal = ({ user, show, onHide, fetchUsers, headers, roles }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        employee_idnumber: user ? user.employee_idnumber : '',
        first_name: user ? user.first_name : '',
        middle_name: user ? user.middle_name : '',
        last_name: user ? user.last_name : '',
        suffix: user ? user.suffix : '',
        birthdate: user ? user.birthdate : '',
        email: user ? user.email : '',
        password: user ? user.password : '',
        role_id: user ? user.role_id : '',
        status: user ? user.status : 'active', 
    });
  
    // Password visiblity
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
                role_id: user.role_id,
                status: user.status || 'active', 
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        validateField(name, value);
    };


    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Place validation here
        if (name === 'employee_idnumber') {
            const idFormat = /^\d{2}-\d{5}$/; // Matches "00-00000" format
            if (!idFormat.test(value)) {
                newErrors.employee_idnumber = 'Employee ID Number format should be "00-00000".';
            } else {
                newErrors.employee_idnumber = '';
            }
        }

        // Validate First Name
        if (name === 'first_name') {
            const nameFormat = /^[A-Z][a-zA-Z .-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
            if (!nameFormat.test(value)) {
                newErrors.first_name = 'First name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.first_name = '';
            }
        }

        // Validate Middle Name
        if (name === 'middle_name' && value) { // Middle name is optional
            const nameFormat = /^[A-Z][a-zA-Z .-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
            if (!nameFormat.test(value)) {
                newErrors.middle_name = 'Middle name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.middle_name = '';
            }
        }

        // Validate Last Name
        if (name === 'last_name') {
            const nameFormat = /^[A-Z][a-zA-Z .-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
            if (!nameFormat.test(value)) {
                newErrors.last_name = 'Last name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.last_name = '';
            }
        }

        // Validate Suffix
        if (name === 'suffix' && value) { // Suffix is optional
            const nameFormat = /^[A-Z][a-zA-Z .-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
            if (!nameFormat.test(value)) {
                newErrors.suffix = 'Suffix must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.suffix = '';
            }
        }

        // Validate Email
        if (name === 'email') {
            const emailFormat = /^[a-zA-Z0-9._%+-]+@gncf\.edu\.ph$/; // Must end with "@ncf.edu.ph"
            if (!emailFormat.test(value)) {
                newErrors.email = 'Email must end with "@ncf.edu.ph".';
            } else {
                newErrors.email = '';
            }
        }

        // Validate Password Length
        if (name === 'password' && value) {
            if (value.length < 3) {
                newErrors.password = 'Password must be at least 3 characters long.';
            } else {
                newErrors.password = '';
            }
        }

        setErrors(newErrors);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            Swal.fire({
                icon: 'success',
                title: 'Form Submitted',
                text: 'Employee details have been successfully updated.',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an issue submitting the form.',
            });
        }
    
    
// Basic form validation
if (!formData.employee_idnumber || !formData.first_name || !formData.last_name || !formData.email || !formData.role_id) {
    let missingFields = [];

    // Identify missing fields
    if (!formData.employee_idnumber) missingFields.push("Employee ID Number");
    if (!formData.first_name) missingFields.push("First Name");
    if (!formData.last_name) missingFields.push("Last Name");
    if (!formData.email) missingFields.push("Email");
    if (!formData.role_id) missingFields.push("Role");

    // Create a more informative message
    Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: `Please fill in the following required fields: ${missingFields.join(", ")}.`,
    });
    return;
}
        Swal.fire({
            title: 'Are you sure you want to save the changes?',
            text: 'You are about to update this employeee’s details.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#B0B0B0',
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
            title: 'Are you sure you want to cancel?',
            text: 'Any unsaved changes will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, close it!',
            cancelButtonText: 'No, keep changes',
        }).then((result) => {
            if (result.isConfirmed) {
                onHide(); 
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                                        style={getInputStyle('employee_idnumber', formData, errors)} 
                                    />
                                    {errors.employee_idnumber && (<div style={{ color: 'red', fontSize: '12px' }}>{errors.employee_idnumber}</div>)}
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

                        {/* Last Name and Suffix */}
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
                                Account Information
                            </h5>
                        </div>
            
                        {/* Email Address and Password */}
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
                                    <div style={{ position: 'relative' }}> {/* Wrapper for field and icon */}
                                        <Form.Control
                                            type={isPasswordVisible ? "text" : "password"} // Toggle between plain text and masked input
                                            name="password"
                                            value={formData.password || ""} // Use formData.password to manage the field's value
                                            onChange={handleChange}
                                            style={{
                                                ...getInputStyle('password', formData, errors),
                                                paddingRight: '2.5rem' // Add space for the eye icon
                                            }}
                                            placeholder="Enter Password"
                                            required
                                        />
                                        <span
                                        onClick={togglePasswordVisibility}
                                        style={{
                                            position: 'absolute',
                                            right: '10px', // Position the icon inside the field, at the rightmost part
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: '#6c757d'
                                        }}
                                        >
                                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Show the appropriate icon */}
                                    </span>
                                </div>
                                    {errors.password && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{errors.password}</div>
                                    )}
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
