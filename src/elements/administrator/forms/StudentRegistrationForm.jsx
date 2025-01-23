import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';

import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../../styles/Registration.css';

export default function StudentRegistrationForm() {
    const navigate = useNavigate();
    const [student_idnumber, setStudentIdNumber] = useState('');
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [year_level, setYearLevel] = useState('');
    const [program_id, setProgram] = useState('');
    const [department_id, setDepartment] = useState('');
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [profile_photo_filename, setPhoto] = useState(null);
    const [error, setError] = useState('');
    const [role_id] = useState(3);
    const [batch, setBatch] = useState('');
    const [errors, setErrors] = useState({});
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [createdBy, setCreatedBy] = useState(''); // State to hold the full name or user info

  
      useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        const userId = localStorage.getItem('user_id'); // Extract user ID from localStorage
      
        if (token && roleId === '1') {
          setCreatedBy(userId); // Directly set userId as the createdBy value
        } else {
          console.error('Token is required for accessing this.');
        }
      }, []);
      


    // Set the styles for the fields
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


    // Generate years for the batch field
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 31 }, (_, index) => currentYear - 5 + index);    
    

    // Fetch roles and departments
    useEffect(() => {
        axios.get('https://test-backend-api-2.onrender.com/programs')
            .then(response => {
                setPrograms(response.data);
            })
            .catch(error => {
                console.error('Error fetching programs', error);
            });

        axios.get('https://test-backend-api-2.onrender.com/departments')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments', error);
            });
    }, []);


    useEffect(() => {
        if (department_id) {
            axios
                .get(`https://test-backend-api-2.onrender.com/active-programs/${department_id}`)
                .then((response) => {
                    setFilteredPrograms(response.data); 
                })
                .catch((error) => {
                    console.error('Error fetching programs:', error);
                    setFilteredPrograms([]); 
                });
        }
    }, [department_id]);


    // Validate input fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Validate ID Number
        if (name === 'student_idnumber') {
            const idFormat = /^\d{2}-\d{5}$/; 
            if (!idFormat.test(value)) {
                newErrors.student_idnumber = 'Student ID number format should be "00-00000".';
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
                student_idnumber,
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


    // Handle the register employee
    const handleRegistration = async (e) => {
        e.preventDefault();
    
        if (!validateAllFields()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Failed',
                text: 'Please fix the errors in the form before submitting.',
            });
            return;
        }
        const confirmRegistration = await Swal.fire({
            title: 'Are you sure you want to register this user?',
            text: 'You are about to create a new student account.',
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
            const response = await axios.post('https://test-backend-api-2.onrender.com/register-student', {
                student_idnumber,
                first_name,
                middle_name,
                last_name,
                suffix,
                birthdate,
                email,
                password,
                year_level,
                profile_photo_filename,
                program_id,
                department_id,
                role_id,
                batch,
                created_by: createdBy,
            });
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You successfully registered a new student.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });                
    
            navigate('/admin-usermanagement');
        } catch (error) {
            console.error('Registration failed', error);

            let errorMessage = 'An unknown error occurred';

            if (error.response) {
                console.error('Error response:', error.response); 
    
                if (error.response.data) {
                    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            let friendlyMessage = 'Registration failed. Please try again later!';
    
            if (errorMessage) {
                switch (errorMessage) {
                    case 'DUPLICATE_STUDENT_ID':
                        friendlyMessage = 'A student with this student ID number already exists.';
                        break;
                    case 'DUPLICATE_EMAIL':
                        friendlyMessage = 'A student with this email already exists.';
                        break;
                    case 'MISSING_BIRTHDATE':
                        friendlyMessage = 'Please provide a valid birthdate.';
                        break;
                    case 'MISSING_REQUIRED_FIELDS':
                        friendlyMessage = 'Please fill in all required fields.';
                        break;
                    default:
                        friendlyMessage = errorMessage; 
                        break;
                }
            }
    
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: friendlyMessage,
            });
        }
    };
    
    
    // Handle the cancel register student
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
    

return (
    <div className="registration-group">
        <div className="container1">
            <h1>Student Registration</h1>
        </div>

            <div className="container2">
                <form className="form" onSubmit={handleRegistration}>

                    {/* Personal Information */}
                    <fieldset className="form-section">
                        <legend className="form-legend">Personal Information</legend>
                        <div className="input-group">
                            <label htmlFor="student_idnumber" className="label">Student ID Number:</label>
                                <input
                                    id="student_idnumber"
                                    name="student_idnumber"
                                    type="text"
                                    placeholder="00-00000"
                                    value={student_idnumber}
                                    onChange={(e) => {
                                        setStudentIdNumber(e.target.value);
                                        validateField('student_idnumber', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('student_idnumber', e.target.value)}
                                    style={getInputStyle('student_idnumber', { student_idnumber }, errors)}
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
                            {errors.student_idnumber && (
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '170px', marginBottom: '20px' }}>{errors.student_idnumber}</div>
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

                    {/* Academic Information */}
                    <fieldset className="form-section">
                        <legend className="form-legend">Academic Information</legend>
                        <div className="input-group-row">
                            <div className="input-group">
                                <label htmlFor="year_level" className="label">Year Level:</label>
                                <select id="year_level" className="short-select" value={year_level} onChange={(e) => setYearLevel(e.target.value)} required style={{ marginRight: '20px' }}>
                                    <option value="" disabled>Select Year Level</option>
                                    <option value="First Year">First Year</option>
                                    <option value="Second Year">Second Year</option>
                                    <option value="Third Year">Third Year</option>
                                    <option value="Fourth Year">Fourth Year</option>
                                    <option value="Fifth Year">Fifth Year</option>
                                </select>
                                <label htmlFor="batch" className="label">Batch:</label>
                                <select id="batch" className="short-select" value={batch} onChange={(e) => setBatch(e.target.value)} required>
                                    <option value="" disabled>Select Batch</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="input-group-row">
                            <div className="input-group">
                                <label htmlFor="department" className="label">Department:</label>
                                <select id="department" className="short-select" value={department_id} onChange={(e) => setDepartment(e.target.value)} required style={{ marginRight: '20px' }}>
                                    <option value="" disabled>Select Department</option>
                                    {departments.filter(department => department.status === 'active').map(department => (
                                        <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
                                    ))}
                                </select>
                                <label htmlFor="program" className="label">Program:</label>
                                <select id="program" className="short-select" value={program_id} onChange={(e) => setProgram(e.target.value)} required>
                                    <option value="" disabled>Select Program</option>
                                    {filteredPrograms.map(program => (
                                        <option key={program.program_id} value={program.program_id}>{program.program_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Account Information */}
                    <fieldset className="form-section">
                        <legend className="form-legend">Account Information</legend>
                        <div className="input-group">
                            <label htmlFor="email" className="label">Email Address:</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="username@gbox.ncf.edu.ph"
                                value={email}
                                onChange={(e) => {
                                    let inputValue = e.target.value;

                                    if (!inputValue.includes('@gbox.ncf.edu.ph') && inputValue !== '') {
                                        const username = inputValue.split('@')[0];
                                        inputValue = username + '@gbox.ncf.edu.ph';
                                    }
                                    setEmail(inputValue);

                                    // Move the cursor just before the '@' symbol
                                    const inputElement = e.target;
                                    const atSymbolIndex = inputValue.indexOf('@');
                                    if (atSymbolIndex !== -1) {
                                        requestAnimationFrame(() => {
                                            inputElement.selectionStart = atSymbolIndex;
                                            inputElement.selectionEnd = atSymbolIndex;
                                        });
                                    }
                                    validateField('email', inputValue);
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

                        <div className="input-group" style={{ display: 'none' }}>
                            <label htmlFor="createdBy" className="label">Created By:</label>
                            <input
                                id="createdBy"
                                name="createdBy"
                                type="text"
                                value={createdBy} 
                                readOnly
                            />
                        </div>
                    </fieldset>
                    {/* Buttons */}
                    <div className="btn-container">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
