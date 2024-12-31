import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear + index);

    useEffect(() => {
        axios.get('http://localhost:9000/programs')
            .then(response => {
                setPrograms(response.data);
            })
            .catch(error => {
                console.error('Error fetching programs', error);
            });

        axios.get('http://localhost:9000/departments')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments', error);
            });
    }, []);

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/register-student', {
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
            });
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You successfully registered a new student.',
            });
            navigate('/admin-usermanagement');
        } catch (error) {
            console.error('Registration failed', error);
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Registration failed. Please try again later!',
            });
        }
    };


    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will lose any unsaved changes!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep editing!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, navigate to the desired page
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
                            <label htmlFor="first_name" className="label">Student ID Number:</label>
                            <input id="studentId" type="text" placeholder="00-00000" value={student_idnumber} onChange={(e) => setStudentIdNumber(e.target.value)} required style={{ marginRight: '20px' }} />
                            <label htmlFor="birthdate" className="label">Birthdate:</label>
                            <input
                                id="birthdate"
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                className="birthdate-input"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="first_name" className="label">First Name:</label>
                            <input type="text" id="first_name" placeholder="Enter First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required style={{ marginRight: '20px' }} />
                            <label htmlFor="middle_name" className="label">Middle Name:</label>
                            <input type="text" id="middle_name" placeholder="Enter Middle Name (if applicable)" value={middle_name} onChange={(e) => setMiddleName(e.target.value)}/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="last_name" className="label">Last Name:</label>
                            <input type="text" id="last_name" placeholder="Enter Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} required style={{ marginRight: '20px' }} />
                            <label htmlFor="suffix" className="label">Suffix:</label>
                            <input type="text" id="suffix" placeholder="Enter Suffix (if applicable)" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                        </div>
                    </fieldset>

                    {/* Academic Information */}
                    <fieldset className="form-section">
                        <legend className="form-legend">Academic Information</legend>
                        <div className="input-group-row">
                            <div className="input-group">
                                <label htmlFor="year_level" className="label">Year Level:</label>
                                <select id="year_level" className="short-select" value={year_level} onChange={(e) => setYearLevel(e.target.value)} required style={{ marginRight: '20px' }}>
                                    <option value="">Select Year Level</option>
                                    <option value="First Year">First Year</option>
                                    <option value="Second Year">Second Year</option>
                                    <option value="Third Year">Third Year</option>
                                    <option value="Fourth Year">Fourth Year</option>
                                    <option value="Fifth Year">Fifth Year</option>
                                </select>
                                <label htmlFor="batch" className="label">Batch:</label>
                                <select id="batch" className="short-select" value={batch} onChange={(e) => setBatch(e.target.value)} required>
                                    <option value="">Select Batch</option>
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
                                    <option value="">Select Department</option>
                                    {departments.map(department => (
                                        <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
                                    ))}
                                </select>
                                <label htmlFor="program" className="label">Program:</label>
                                <select id="program" className="short-select" value={program_id} onChange={(e) => setProgram(e.target.value)} required>
                                    <option value="">Select Program</option>
                                    {programs.map(program => (
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
                            <input id="email" type="email" placeholder="username@gbox.ncf.edu.ph" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginRight: '20px' }}/>
                            <label htmlFor="password" className="label">Password:</label>
                            <input id="password" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </fieldset>

                    <div className="btn-container">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
