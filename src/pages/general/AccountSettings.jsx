import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

        if (!token || !['1', '2', '3'].includes(roleId)) {
            navigate('/unauthorized');
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = response.data;
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

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        if (profilePhoto) {
            formData.append('profile_photo', profilePhoto);
        }

        try {
            const response = await axios.put('/employee/photo', formData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                    'Content-Type': 'multipart/form-data' 
                }
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
                <form onSubmit={handleProfileSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <img 
                                src={user.profile_photo_filename ? `/uploads/${user.profile_photo_filename}` : '/default-profile.png'} 
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '10px' }}
                            />
                            <input type="file" onChange={handlePhotoChange} />
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
