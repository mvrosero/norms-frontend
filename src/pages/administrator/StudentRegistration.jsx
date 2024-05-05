import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Registration.css';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function StudentRegistration() {
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
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/programs')
            .then(response => {
                setPrograms(response.data);
            })
            .catch(error => {
                console.error('Error fetching programs', error);
            });

        axios.get('http://localhost:3001/departments')
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
            const response = await axios.post('http://localhost:3001/register-student', {
                student_idnumber,
                first_name,
                middle_name,
                last_name,
                suffix,
                birthdate,
                email,
                password,
                year_level,
                program_id,
                department_id,
            });
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You successfully registered a new student.',
            });
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

    return (
        <div className="registration-group">
            <div className="container1">
                <h1>Student Registration</h1>
            </div>
            <div className="container2" style={{ height: '580px'}} >
                <form className="form" onSubmit={handleRegistration}>
                    <div className="row">
                        <div className="input-group">
                            <label htmlFor="studentId" className="label">Student ID Number:</label>
                            <input id="studentId" type="text" placeholder="00-00000" value={student_idnumber} onChange={(e) => setStudentIdNumber(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="first_name" className="label">First Name:</label>
                            <input type="text" id="first_name" placeholder="Enter First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required style={{ marginRight: '20px' }} />
                            <label htmlFor="middle_name" className="label">Middle Name:</label>
                            <input type="text" id="middle_name" placeholder="Enter Middle Name (if applicable)" value={middle_name} onChange={(e) => setMiddleName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="last_name" className="label">Last Name:</label>
                            <input type="text" id="last_name" placeholder="Enter Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} required style={{ marginRight: '20px' }} />
                            <label htmlFor="suffix" className="label">Suffix:</label>
                            <input type="text" id="suffix" placeholder="Enter Suffix (if applicable)" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="birthdate" className="label">Birthdate:</label>
                            <DatePicker
                                id="birthdate"
                                selected={birthdate}
                                onChange={(date) => setBirthdate(date)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="MM/DD/YYYY"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={15}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email" className="label">Email Address:</label>
                            <input id="email" type="email" placeholder="username@gbox.ncf.edu.ph" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password" className="label">Password:</label>
                            <input id="password" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="year_level" className="label">Year Level:</label>
                            <select id="year_level" className="short-select" value={year_level} onChange={(e) => setYearLevel(e.target.value)} required>
                                <option value="">Select Year Level</option>
                                <option value="1">First Year</option>
                                <option value="2">Second Year</option>
                                <option value="3">Third Year</option>
                                <option value="4">Fourth Year</option>
                                <option value="4">Fifth Year</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="department" className="label">Department:</label>
                            <select id="department" className="short-select" value={department_id} onChange={(e) => setDepartment(e.target.value)} required>
                                <option value="">Select Department</option>
                                {departments.map(department => (
                                    <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="program" className="label">Program:</label>
                            <select id="program" className="short-select" value={program_id} onChange={(e) => setProgram(e.target.value)} required>
                                <option value="">Select Program</option>
                                {programs.map(program => (
                                    <option key={program.program_id} value={program.program_id}>{program.program_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="btn-container">
                        <button type="button" className="cancel-btn">Cancel</button>
                        <button type="submit" className="btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
