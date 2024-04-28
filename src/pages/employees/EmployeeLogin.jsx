import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const EmployeeLogin = () => {
    const navigate = useNavigate();

    const [employee_idnumber, setUserNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await axios.post('http://localhost:3001/EmployeeLogin', {
                employee_idnumber,
                password,
            });

            navigate('/admin-usermanagement'); // Handle redirection based on role  
        } catch (error) {
            console.error('Login failed', error);
            // Handle error (e.g., display error message)
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="wrapper bg-white">
            <div className="h2 text-center">Creativity</div>
            <div className="h4 text-muted text-center pt-2">Enter your login details</div>
            <form className="pt-3" onSubmit={handleLogin}>
                <div className="form-group py-2">
                    <div className="input-field">
                        <FontAwesomeIcon icon={faUser} className="p-2" />
                        <input type="text" placeholder="Employee Number" value={employee_idnumber} onChange={(e) => setUserNumber(e.target.value)} required />
                    </div>
                </div>
                <div className="form-group py-1 pb-2">
                    <div className="input-field">
                        <FontAwesomeIcon icon={faLock} className="p-2" />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" className="btn bg-white text-muted" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </button>
                    </div>
                </div>
                <div className="d-flex align-items-start">
                    <div className="remember">
                        <label className="option text-muted"> Remember me
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className="ml-auto">
                        <a href="#" id="forgot">Forgot Password?</a>
                    </div>
                </div>
                <button type="submit" className="btn btn-block text-center my-3">Log in</button>
                <div className="text-center pt-3 text-muted">Not a member? <a href="/registration">Sign up</a></div>
            </form>
        </div>
    );
};

export default EmployeeLogin;
