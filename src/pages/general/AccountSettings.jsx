import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import AdminNavigation from '../administrator/AdminNavigation';
import AdminInfo from '../administrator/AdminInfo';
import CoordinatorNavigation from '../osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../osa coordinator/CoordinatorInfo';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';

export default function AccountSettings() {
    const navigate = useNavigate();
    const roleId = localStorage.getItem('role_id');
    const [user, setUser] = useState({});
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token || !['1', '2', '4'].includes(roleId)) {
            navigate('/unauthorized');
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = response.data;
                // Ensure birthdate is a valid Date object
                if (userData.birthdate) {
                    userData.birthdate = new Date(userData.birthdate);
                }
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, [navigate, roleId]);

    const handlePhotoChange = (event) => {
        setProfilePhoto(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('profile_photo', profilePhoto);
        formData.append('first_name', user.first_name);
        formData.append('middle_name', user.middle_name);
        formData.append('last_name', user.last_name);
        formData.append('suffix', user.suffix);
        formData.append('birthdate', user.birthdate.toISOString());
        formData.append('email', user.email);
        formData.append('year_level', user.year_level);

        try {
            const response = await axios.post('/api/user/update', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully',
            });
        } catch (error) {
            console.error('Failed to update profile', error);
            Swal.fire({
                icon: 'error',
                title: 'Profile update failed',
                text: 'Please try again later!',
            });
        }
    };

    const renderNavigation = () => {
        switch (roleId) {
            case '1':
                return <><AdminNavigation /><AdminInfo /></>;
            case '2':
                return <><CoordinatorNavigation /><CoordinatorInfo /></>;
            case '3':
                return <><StudentNavigation /><StudentInfo /></>;
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {renderNavigation()}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1 style={{ fontFamily: 'Poppins', fontSize: '40px', fontWeight: '900', color: 'white' }}>Account Settings</h1>
            </div>
            <div style={{ width: '80%', background: '#f5f5f5', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <img 
                                src={user.profile_photo_filename ? `/uploads/${user.profile_photo_filename}` : '/default-profile.png'} 
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '10px' }}
                            />
                            <input type="file" onChange={handlePhotoChange} />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="first_name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name:</label>
                            <input 
                                type="text" 
                                id="first_name" 
                                placeholder="Enter First Name" 
                                value={user.first_name} 
                                onChange={(e) => setUser({ ...user, first_name: e.target.value })} 
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="middle_name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Middle Name:</label>
                            <input 
                                type="text" 
                                id="middle_name" 
                                placeholder="Enter Middle Name (if applicable)" 
                                value={user.middle_name} 
                                onChange={(e) => setUser({ ...user, middle_name: e.target.value })} 
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="last_name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name:</label>
                            <input 
                                type="text" 
                                id="last_name" 
                                placeholder="Enter Last Name" 
                                value={user.last_name} 
                                onChange={(e) => setUser({ ...user, last_name: e.target.value })} 
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="suffix" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Suffix:</label>
                            <input 
                                type="text" 
                                id="suffix" 
                                placeholder="Enter Suffix (if applicable)" 
                                value={user.suffix} 
                                onChange={(e) => setUser({ ...user, suffix: e.target.value })} 
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="birthdate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Birthdate:</label>
                            <DatePicker
                                id="birthdate"
                                selected={user.birthdate ? new Date(user.birthdate) : null}
                                onChange={(date) => setUser({ ...user, birthdate: date })}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="MM/DD/YYYY"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={15}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address:</label>
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="username@gbox.ncf.edu.ph" 
                                value={user.email} 
                                onChange={(e) => setUser({ ...user, email: e.target.value })} 
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                            <label htmlFor="year_level" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Year Level:</label>
                            <input 
                                id="year_level" 
                                type="text" 
                                placeholder="Enter Year Level" 
                                value={user.year_level} 
                                onChange={(e) => setUser({ ...user, year_level: e.target.value })} 
                                style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/profile')}
                            style={{ padding: '10px 20px', borderRadius: '3px', backgroundColor: '#ccc', border: 'none', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            style={{ padding: '10px 20px', borderRadius: '3px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
