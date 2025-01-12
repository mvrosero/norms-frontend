import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import osaMotto from '../../components/images/osa_motto.png';
import osaLogo from '../../components/images/osa_logo.png';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [employee_idnumber, setEmployeeNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/admin-login', {
                employee_idnumber,
                password
            });
    
            console.log('Server Response:', response.data);
    
            if (response.status === 200 && response.data.hasOwnProperty('token')) {
                const { token, role_id, user_id, employee_idnumber: loggedInEmployeeIdNumber, is_active } = response.data;
    
                // Check if user is active based on the 'is_active' field
                if (!is_active) {  
                    navigate('/account-limited'); 
                    return; 
                }
    
                // Proceed with login if the user is active
                localStorage.setItem('token', token);
                localStorage.setItem('role_id', role_id);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('employee_idnumber', loggedInEmployeeIdNumber);
    
                // Prevent redirection if the role is not admin
                if (role_id === 1) {
                    navigate('/admin-dashboard'); 
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome back, Admin!',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Unauthorized role.',
                    });
                }
            } else {
                console.error('Token not found in response data');
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'An error occurred while processing the login data. Please try again later.',
                });
            }
        } catch (error) {
            console.error('Login failed:', error);
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


return (
    <div style={{ backgroundImage: `url(${osaMotto})`, backgroundSize: '100% 100%', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="wrapper" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '500px', marginLeft: '600px', marginRight: '10px', marginTop: '50px' }}>
            <div className="bg-green" style={{ backgroundColor: '#134E0F', width: '390px', height: '380px', padding: '20px', borderRadius: '20px', position: 'relative' }}>
                <div className="white-circle" style={{ width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)' }}></div>
                <div className="profile-image" style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)' }}>
                    <img src={osaLogo} alt="OSA Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="h4 text-center pt-4" style={{ fontFamily: 'Inter', fontWeight: '900', fontSize: '35px', color: '#FFFFFF', marginTop: '50px' }}>Admin Login</div>
                <form className="pt-3" onSubmit={handleLogin}>
                    <div className="form-group py-1" style={{ marginBottom: '1px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px', marginTop: '1px' }}>
                            <div style={{ backgroundColor: 'white', borderRadius: '20% 0 0 20%', width: '50px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faUser} size="lg" style={{ color: '#134E0F' }}/>
                            </div>
                            <input type="text" placeholder="Employee Number" value={employee_idnumber} onChange={(e) => setEmployeeNumber(e.target.value)} required style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0 7px 7px 0', padding: '10px', marginLeft: '0px', width: '100%', '::placeholder': { color: '#818181' } }} />
                        </div>
                    </div>
                    <div className="form-group py-2" style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px', marginTop: '1px' }}>
                            <div style={{ backgroundColor: 'white', borderRadius: '20% 0 0 20%', width: '50px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faLock} size="lg" style={{ color: '#134E0F' }}/>
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


export default AdminLogin;
