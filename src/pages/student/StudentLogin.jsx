import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { FiLock } from 'react-icons/fi';
import Swal from 'sweetalert2';

import osaMotto from '../../components/images/osa_motto.png'; // Importing the background image
import osaLogo from '../../components/images/osa_logo.png'; // Importing the profile image

const StudentLogin = () => {
    const navigate = useNavigate();

    const [student_idnumber, setUserNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await axios.post('http://localhost:3001/StudentLogin', {
                student_idnumber,
                password,
                birthdate: 'YYYY-MM-DD' // Replace 'YYYY-MM-DD' with the actual birthdate string
            });
            
            // Redirect to birthdate verification page
            navigate('/birthdate-verification');
        } catch (error) {
            console.error('Login failed', error);
            // Display error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials. Please try again.',
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ backgroundImage: `url(${osaMotto})`, backgroundSize: '100% 100%', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="wrapper" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '500px', marginLeft: '600px', marginRight: '10px', marginTop: '50px' }}>
                <div className="bg-green" style={{ backgroundColor: '#134E0F', width: '390px', height: '380px', padding: '20px', borderRadius: '20px', position: 'relative' }}>
                    <div className="white-circle" style={{ width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="profile-image" style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)' }}>
                        <img src={osaLogo} alt="OSA Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="h4 text-center pt-4" style={{ fontFamily: 'Inter', fontWeight: '900', fontSize: '35px', color: '#FFFFFF', marginTop: '50px' }}>Student Login</div>
                    <form className="pt-3" onSubmit={handleLogin}>
                        <div className="form-group py-1" style={{ marginBottom: '1px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px', marginTop: '1px' }}> {/* Reduced marginBottom */}
                                <div style={{ backgroundColor: 'white', borderRadius: '20% 0 0 20%', width: '50px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FiUser size={22} style={{ color: '#134E0F' }}/>
                                </div>
                                <input type="text" placeholder="Student Number" value={student_idnumber} onChange={(e) => setUserNumber(e.target.value)} required style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0 7px 7px 0', padding: '10px', marginLeft: '0px', width: '100%', '::placeholder': { color: '#818181' } }} />
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

export default StudentLogin;
