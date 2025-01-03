import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2'; 

import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../../styles/Registration.css';

export default function EmployeeRegistrationForm() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [employee_idnumber, setEmployeeIdNumber] = useState('');
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile_photo_filename, setphoto] = useState(null);
    const [role_id, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const inputStyle = {
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
    };

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (token && roleId === '1') {
            axios.get('http://localhost:9000/roles')
                .then(response => {
                    setRoles(response.data);
                })
                .catch(error => {
                    console.error('Error fetching roles', error);
                });
        } else {
            // Redirect or handle unauthorized access
            console.error("Token with role_id 1 is required for accessing this page.");
        }
    }, []);



    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'employee_idnumber') {
            const idFormat = /^\d{2}-\d{5}$/; // Matches "00-00000" format
            if (!idFormat.test(value)) {
                newErrors.employee_idnumber = 'Employee ID number format should be "00-00000".';
            } else {
                newErrors.employee_idnumber = '';
            }
        }

        // Validate First Name
        if (name === 'first_name') {
            const nameFormat = /^[A-Z][a-zA-Z .'-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
            if (!nameFormat.test(value)) {
                newErrors.first_name = 'First name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.first_name = '';
            }
        }

        // Validate Middle Name
        if (name === 'middle_name' && value) { // Middle name is optional
            const nameFormat = /^[A-Z][a-zA-Z .'-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
            if (!nameFormat.test(value)) {
                newErrors.middle_name = 'Middle name must start with a capital letter and can contain only letters, spaces, dots, or dashes.';
            } else {
                newErrors.middle_name = '';
            }
        }

        // Validate Last Name
        if (name === 'last_name') {
            const nameFormat = /^[A-Z][a-zA-Z .'-]*$/; // Capital letter followed by letters, spaces, dots, or dashes
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
            const emailFormat = /^[a-zA-Z0-9._%+-]+@ncf\.edu\.ph$/; // Must end with "@ncf.edu.ph"
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




        const validateAllFields = () => {
            const allFields = {
                employee_idnumber,
                first_name,
                middle_name,
                last_name,
                suffix,
                email,
                password,
            };
        
            let valid = true;
            Object.keys(allFields).forEach((field) => {
                validateField(field, allFields[field]);
                if (errors[field]) {
                    valid = false;
                }
            });
        
            return valid;
        };





    const handleRegistration = async (e) => {
        e.preventDefault();

        // Validate all fields before proceeding
        if (!validateAllFields()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Failed',
                text: 'Please fix the errors in the form before submitting.',
            });
            return;
        }

        // Confirmation before proceeding with registration
        const confirmRegistration = await Swal.fire({
            title: 'Are you sure you want to register this user?',
            text: 'You are about to create a new employee account.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, register',
            cancelButtonText: 'Cancel',
        });

        if (!confirmRegistration.isConfirmed) {
            return; 
        }




        try {
            const response = await axios.post('http://localhost:9000/register-employee', {
                employee_idnumber,
                first_name,
                middle_name,
                last_name,
                suffix,
                birthdate,
                email,
                password,
                profile_photo_filename,
                role_id
            });
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You successfully registered a new employee.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            // Navigate back to admin user management page after successful registration
            navigate('/admin-usermanagement');
        } catch (error) {
            console.error('Registration failed', error); // Log the entire error object for debugging
        
            // Default error message if no specific message is found
            let errorMessage = 'An unknown error occurred';
    
            // Check if error.response is available and contains relevant info
            if (error.response) {
                console.error('Error response:', error.response); // Log the error response for debugging
    
                // Extract error message from server response if available
                if (error.response.data) {
                    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
    
            // Handle specific error messages
            let friendlyMessage = 'Registration failed. Please try again later!';
    
            if (errorMessage) {
                switch (errorMessage) {
                    case 'DUPLICATE_EMPLOYEE_ID':
                        friendlyMessage = 'An employee with this employee ID number already exists.';
                        break;
                    case 'DUPLICATE_EMAIL':
                        friendlyMessage = 'An employee with this email already exists.';
                        break;
                    case 'MISSING_BIRTHDATE':
                        friendlyMessage = 'Please provide a valid birthdate.';
                        break;
                    case 'MISSING_REQUIRED_FIELDS':
                        friendlyMessage = 'Please fill in all required fields.';
                        break;
                    default:
                        friendlyMessage = errorMessage; // Display the actual error message
                        break;
                }
            }
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Registration failed. Please try again later!',
            });
        }
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
                navigate('/admin-usermanagement');
            }
        });
    };

    if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '1') {
        return null; // Do not render anything if token or role_id is invalid
    }

    return (
        <div className="registration-group">
            <div className="container1">
                <h1>Employee Registration</h1>
            </div>
            <div className="container2" style={{ height: '480px'}}>
                <form className="form" onSubmit={handleRegistration}>
                    {/* Personal Information */}
                    <fieldset className="form-section">
                        <legend className="form-legend">Personal Information</legend>
                        <div className="input-group">
                            <label htmlFor="employee_idnumber" className="label">Employee ID Number:</label>
                                <input
                                    id="employee_idnumber"
                                    name="employee_idnumber"
                                    type="text"
                                    placeholder="00-00000"
                                    value={employee_idnumber}
                                    onChange={(e) => {
                                        setEmployeeIdNumber(e.target.value);
                                        validateField('employee_idnumber', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('employee_idnumber', e.target.value)}
                                    style={getInputStyle('employee_idnumber', { employee_idnumber }, errors)}
                                    required
                                />
                            <label htmlFor="birthdate" className="label">Birthdate:</label>
                                <input
                                    id="birthdate"
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    className="birthdate-input"
                                    required
                                />
                        </div>
                            {errors.employee_idnumber && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px', marginBottom: '20px' }}>{errors.employee_idnumber}</div>
                            )}

                        <div className="input-group">
                            <label htmlFor="first_name" className="label">First Name:</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    placeholder="Enter First Name"
                                    value={first_name}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        validateField('first_name', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('first_name', e.target.value)}
                                    style={getInputStyle('first_name', { first_name }, errors)}
                                    required
                                />
                            <label htmlFor="middle_name" className="label">Middle Name:</label>
                                <input
                                    type="text"
                                    id="middle_name"
                                    placeholder="Enter Middle Name (if applicable)"
                                    value={middle_name}
                                    onChange={(e) => {
                                        setMiddleName(e.target.value);
                                        validateField('middle_name', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('middle_name', e.target.value)}
                                    style={getInputStyle('middle_name', { middle_name }, errors)}
                                />
                        </div>
                        <div className="input-group">
                            <label htmlFor="last_name" className="label">Last Name:</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    placeholder="Enter Last Name"
                                    value={last_name}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        validateField('last_name', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('last_name', e.target.value)}
                                    style={getInputStyle('last_name', { last_name }, errors)}
                                    required
                                />
                            <label htmlFor="suffix" className="label">Suffix:</label>
                                <input
                                    type="text"
                                    id="suffix"
                                    placeholder="Enter Suffix (if applicable)"
                                    value={suffix}
                                    onChange={(e) => {
                                        setSuffix(e.target.value);
                                        validateField('suffix', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('suffix', e.target.value)}
                                    style={getInputStyle('suffix', { suffix }, errors)}
                                />
                            {errors.first_name && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px' }}>
                                    {errors.first_name}
                                </div>
                            )}
                            {errors.middle_name && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px' }}>
                                    {errors.middle_name}
                                </div>
                            )}
                            {errors.last_name && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px' }}>
                                    {errors.last_name}
                                </div>
                            )}
                            {errors.suffix && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px' }}>
                                    {errors.suffix}
                                </div>
                            )}
                        </div>
                    </fieldset>


                    {/* Account Information */}
                    <fieldset className="form-section">
                        <legend className="form-legend">Account Information</legend>
                        <div className="input-group">
                            <label htmlFor="role" className="label">Role:</label>
                                <select id="role" className="short-select" value={role_id} onChange={(e) => setRole(e.target.value)} required>
                                    <option disabled value="">Select Role</option>
                                    {roles.filter(role => role.role_name.toLowerCase() !== 'student').map(role => (
                                        <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                    ))}
                                </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="email" className="label">Email Address:</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="username@ncf.edu.ph"
                                    value={email}
                                    onChange={(e) => {
                                        let newValue = e.target.value;
                                        if (!newValue.includes('@ncf.edu.ph') && newValue !== '') {
                                            newValue = newValue.split('@')[0] + '@ncf.edu.ph'; 
                                        }
                                        setEmail(newValue);
                                        validateField('email', newValue);
                                    }}
                                    onBlur={(e) => validateField('email', e.target.value)}
                                    style={getInputStyle('email', { email }, errors)}
                                    required
                                />
                            <label htmlFor="password" className="label">Password:</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validateField('password', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('password', e.target.value)}
                                    style={getInputStyle('password', { password }, errors)}
                                    required
                                />
                        </div>
                            {errors.email && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px' }}>
                                    {errors.email}
                                </div>
                            )}
                            {errors.password && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px' }}>
                                    {errors.password}
                                </div>
                            )}
                    </fieldset>

                    
                    <div class="btn-container">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button type="submit" class="save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
