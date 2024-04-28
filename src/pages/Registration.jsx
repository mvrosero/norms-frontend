import React, { useState,useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Registration.css';
import Swal from 'sweetalert2'; // Import Swal from sweetalert2
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Registration() {
    const [employee_idnumber, setEmployeeIdNumber] = useState('');
    const [fullname, setFullname] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role_id, setRole] = useState('');
    const [department_id, setDepartment] = useState('');
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        // Fetch roles
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
    }, []); // Empty dependency array to run only once when component mounts

  

    



    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/registerEmployee', {
                employee_idnumber,
                fullname,
                birthdate,
                email,
                password,
                role_id,
                department_id,
            });
            console.log(response.data);
            // Show SweetAlert popup after successful registration
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You have been successfully registered.',
            });
        } catch (error) {
            console.error('Registration failed', error);
            setError(error.message); // Set error message state
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Registration failed. Please try again later!',
            });
        }
           // Debugging: Log state variables
    console.log('Employee ID:', employee_idnumber);
    console.log('Full Name:', fullname);
    console.log('Birthdate:', birthdate);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role ID:', role_id);
    console.log('Department ID:', department_id);
    console.log('Roles:', roles);
    console.log('Departments:', departments);
    console.log('Error:', error);
    };

    
    return (
        <div className="container1">
            <h1>Registration</h1>
            <form className="form" onSubmit={handleRegistration}>
                <div className="row">
                    <h4>Account</h4>
                    <div className="input-group input-group-icon">
                        <input type="text" placeholder="Employee Id" value={employee_idnumber} onChange={(e) => setEmployeeIdNumber(e.target.value)} />
                        <div className="input-icon"><i className="fa fa-user"></i></div>
                    </div>
                    <div className="input-group input-group-icon">
                        <input type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        <div className="input-icon"><i className="fa fa-user"></i></div>
                    </div>
                    
                    <div className="input-group input-group-icon">
                       {/* Add a label for birthdate */}
                        <DatePicker
                            id="birthdate"
                            selected={birthdate}
                            onChange={(date) => setBirthdate(date)}
                            dateFormat="MM/dd/yyyy" // Define the date format
                            placeholderText="MM/DD/YYYY" // Set placeholder text
                            showYearDropdown // Show year dropdown
                            scrollableYearDropdown // Make year dropdown scrollable
                            yearDropdownItemNumber={15} // Number of years shown in the dropdown
                            
                        />
                         <div className="input-icon"><i className="fa fa-calendar"></i></div>
                    </div>
                    <div className="input-group input-group-icon">
                        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div className="input-icon"><i className="fa fa-envelope"></i></div>
                    </div>
                    <div className="input-group input-group-icon">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="input-icon"><i className="fa fa-key"></i></div>
                    </div>
                 
                    <div className="input-group input-group-icon">
    <select className="short-select" value={role_id} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        {roles.map(role => (
            <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
        ))}
    </select>
    <div className="input-icon"><i className="fa fa-id-badge"></i></div>
</div>

<div className="input-group input-group-icon">
    <select className="short-select" value={department_id} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">Select Department</option>
        {departments.map(department => (
            <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
        ))}
    </select>
    <div className="input-icon"><i className="fa fa-home"></i></div>
</div>


                </div>
                
                
                <button type="submit" className="custom-button">Submit</button>
            </form>
        </div>
    );
}
