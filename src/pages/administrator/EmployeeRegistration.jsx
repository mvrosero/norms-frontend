import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Registration.css'; // Updated CSS file import
import Swal from 'sweetalert2'; // Import Swal from sweetalert2
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function EmployeeRegistration() {
    const [employee_idnumber, setEmployeeIdNumber] = useState('');
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role_id, setRole] = useState('');
    const [department_id, setDepartment] = useState('');
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/roles')
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles', error);
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
            const response = await axios.post('http://localhost:3001/register-employee', {
                employee_idnumber,
                first_name,
                middle_name,
                last_name,
                suffix,
                birthdate,
                email,
                password,
                role_id,
                department_id,
            });
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You successfully registered a new user.',
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
                <h1>Employee Registration</h1>
            </div>
            <div className="container2">
                <form className="form" onSubmit={handleRegistration}>
                    <div className="row">
                    <div className="input-group">
                        <label htmlFor="employeeId" className="label" >Employee ID Number:</label>
                        <input id="employeeId" type="text" placeholder="00-00000" value={employee_idnumber} onChange={(e) => setEmployeeIdNumber(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="first_name" className="label">First Name:</label>
                        <input type="text" id="first_name" placeholder="Enter First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required style={{ marginRight: '20px' }} />
                        <label htmlFor="middle_name" className="label">Middle Name:</label>
                        <input type="text" id="middle_name" placeholder="Enter Middle Name (if applicable)" value={middle_name} onChange={(e) => setMiddleName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="last_name" className="label">Last Name:</label>
                        <input type="text" id="last_name" placeholder="Enter Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} required style={{ marginRight: '20px' }}/>
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
                        <label htmlFor="role" className="label">Role:</label>
                        <select id="role" className="short-select" value={role_id} onChange={(e) => setRole(e.target.value)} required>
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                            ))}
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

                    </div>
                    <div class="btn-container">
                        <button type="button" className="cancel-btn">Cancel</button>
                        <button type="submit" class="btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
