import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import Swal from 'sweetalert2';

import osaMotto from '../../components/images/osa_motto.png'; 
import osaLogo from '../../components/images/osa_logo.png'; 

const EmployeeLogin = () => {
    const navigate = useNavigate();

    const [employee_idnumber, setUserNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await axios.post('http://localhost:9000/employee-login', {
                employee_idnumber,
                password,
            });
    
            if (response.status === 200) {
                // Check if the response data contains the token property
                if (response.data.hasOwnProperty('token')) {
                    // Access the token from the response data
                    const token = response.data.token;
                    // Store the token in localStorage
                    localStorage.setItem('token', token);
                    // Redirect to the dashboard or other page
                    navigate(`/coordinator-dashboard`);
                } else {
                    // If the token property is not found in the response data
                    console.error('Token not found in response data');
                    // Display an error message to the user
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'An error occurred while processing the login data. Please try again later.',
                    });
                }
            } else {
                console.error('Login failed with status:', response.status);
                // Display an error message to the user
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid credentials. Please try again.',
                });
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Display an error message to the user
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'An error occurred while processing your request. Please try again later.',
            });
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogout = () => {
        // Clear user session data (example)
        localStorage.removeItem('token');
        localStorage.removeItem('otherData');

        // Redirect to the login page
        navigate('/employee-login'); // Replace '/employee-login' with the actual login page URL
    };

    return (
        <div style={{ backgroundImage: `url(${osaMotto})`, backgroundSize: '100% 100%', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="wrapper" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '500px', marginLeft: '600px', marginRight: '10px', marginTop: '50px' }}>
                <div className="bg-green" style={{ backgroundColor: '#134E0F', width: '390px', height: '380px', padding: '20px', borderRadius: '20px', position: 'relative' }}>
                    <div className="white-circle" style={{ width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="profile-image" style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)' }}>
                        <img src={osaLogo} alt="OSA Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="h4 text-center pt-4" style={{ fontFamily: 'Inter', fontWeight: '900', fontSize: '35px', color: '#FFFFFF', marginTop: '50px' }}>Employee Login</div>
                    <form className="pt-3" onSubmit={handleLogin}>
                        <div className="form-group py-1" style={{ marginBottom: '1px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px', marginTop: '1px' }}> {/* Reduced marginBottom */}
                                <div style={{ backgroundColor: 'white', borderRadius: '20% 0 0 20%', width: '50px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FiUser size={22} style={{ color: '#134E0F' }}/>
                                </div>
                                <input type="text" placeholder="Employee Number" value={employee_idnumber} onChange={(e) => setUserNumber(e.target.value)} required style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0 7px 7px 0', padding: '10px', marginLeft: '0px', width: '100%', '::placeholder': { color: '#818181' } }} />
                            </div>
                        </div>
                        <div className="form-group py-2" style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px', marginTop: '1px' }}> {/* Reduced marginBottom */}
                                <div style={{ backgroundColor: 'white', borderRadius: '20% 0 0 20%', width: '50px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FiLock size={20} style={{ color: '#134E0F' }}/>
                                </div>
                                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0 7px 7px 0', padding: '10px', marginLeft: '0px', width: '100%', '::placeholder': { color: '#818181' } }} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-block text-center" style={{ marginTop: '1px', marginBottom: '1px', backgroundColor: '#FAD32E', borderRadius: '10px', color: 'white', padding: '10px 15px', width: '100%', fontWeight: '600', fontSize: '20px' }}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;
