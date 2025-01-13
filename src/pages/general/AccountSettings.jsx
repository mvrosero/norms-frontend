import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { IoMdClose } from "react-icons/io";

import AdminNavigation from '../administrator/AdminNavigation';
import AdminInfo from '../administrator/AdminInfo';
import CoordinatorNavigation from '../osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../osa coordinator/CoordinatorInfo';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SecurityInfo from '../security/SecurityInfo';

export default function AccountSettings() {
    const navigate = useNavigate();
    const roleId = localStorage.getItem('role_id');
    const userId = localStorage.getItem('user_id'); 

    const [profileFormData, setProfileFormData] = useState({
        profile_photo_filename: null
    });
    const [passwordFormData, setPasswordFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        current_password: false,
        new_password: false,
        confirm_new_password: false
    });
    const [message, setMessage] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(''); 
    

    // Fetch the profile photo
    useEffect(() => {
        const fetchProfilePhoto = async () => {
            try {
                const response = await axios.get(`https://test-backend-api-2.onrender.com/view-profile-photo/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    responseType: 'blob' 
                });
                
                const imageUrl = URL.createObjectURL(response.data);
                setProfilePhotoUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching profile photo:', error);
            }
        };
        fetchProfilePhoto();
    }, [userId]);


     // Display navigation bar based on user role
    const renderNavigation = () => {
        switch (roleId) {
            case '1':
                return <><AdminNavigation /><AdminInfo /></>;
            case '2':
                return <><CoordinatorNavigation /><CoordinatorInfo /></>;
            case '3':
                return <><StudentNavigation /><StudentInfo /></>;
            case '4':
                return <SecurityInfo />;
            default:
                return null;
        }
    };


    const handleProfileInputChange = (e) => {
        if (e.target.name === 'profile_photo_filename') {
            setProfileFormData({ ...profileFormData, [e.target.name]: e.target.files[0] });
        } else {
            setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
        }
    };
    

    const handlePasswordInputChange = (e) => {
        setPasswordFormData({ ...passwordFormData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    // Handle the submit profile photo
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('profile_photo_filename', profileFormData.profile_photo_filename);
    
            const response = await axios.post(`https://test-backend-api-2.onrender.com/upload-profile-photo/${userId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });
            console.log('Response:', response);
            setMessage(response.data.message);
            setProfileFormData({
                profile_photo_filename: null
            });
            setProfilePhotoUrl(response.data.updatedProfilePhotoUrl); 
    
            Swal.fire({
                title: 'Success!',
                text: 'Profile photo updated successfully.',
                icon: 'success',
                timer: 3000,  
                timerProgressBar: true,  
                showConfirmButton: false,  
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue uploading the profile photo. Please try again.',
                icon: 'error',
                showConfirmButton: false,  
                timer: 2000,  
            });
        }
    };
    

    // Handle delete profile photo
    const handleDeleteProfilePhoto = async () => {
        try {
            const response = await axios.delete(`https://test-backend-api-2.onrender.com/delete-profile-photo/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });

            if (response.status === 200) {
                setProfilePhotoUrl(null);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile photo deleted successfully.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error deleting profile photo:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete profile photo.',
                confirmButtonText: 'Try Again',
            });
        }
    };


    // Handle the submit password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordFormData.new_password !== passwordFormData.confirm_new_password) {
            setMessage('New password and confirmation do not match.');
            return;
        }
        try {
            const response = await axios.put(`https://test-backend-api-2.onrender.com/password-change/${userId}`, {
                current_password: passwordFormData.current_password,
                new_password: passwordFormData.new_password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });

            console.log('Password Change Response:', response);
            setPasswordFormData({
                current_password: '',
                new_password: '',
                confirm_new_password: ''
            });
            Swal.fire({
                title: 'Success!',
                text: 'Your password has been changed successfully.',
                icon: 'success',
                timer: 3000,  
                timerProgressBar: true,  
                showConfirmButton: false  
            });

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue while changing your password. Please try again.',
                icon: 'error',
                showConfirmButton: true
            });
        }
    };


    // Handle the cancel button
    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: 'All changes will be lost!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, discard changes',
            cancelButtonText: 'No, keep changes',
            confirmButtonColor: '#3085d6', 
            cancelButtonColor: '#B0B0B0'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload(); 
            }
        });
    };
    

    // Set the styles for the settings
    const formControlStyles = {
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        display: 'block',
        width: '90%',
        marginLeft: '20px',
    };
    
    const formLabelStyles = {
        fontWeight: '600',
        marginTop: '15px',
        marginLeft: '20px',
        fontSize: '15px',
    };

    const buttonStyle = {
        backgroundColor: '#4A90E2',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '900',
        padding: '8px 25px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const cancelButtonStyle = {
        backgroundColor: '#8C8C8C',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '900',
        padding: '8px 25px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };


return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        {renderNavigation()}

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '30px' }}>
                    Account Settings
                </h6>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '95%', paddingTop: '30px', paddingLeft: '75px' }}>

            {/* Profile Photo Upload Form */}
            <Card style={{ boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', marginBottom: '20px', paddingBottom: '30px' }}>
                <Card.Body>
                    <Card.Title
                        style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px', fontWeight: '600', fontFamily: 'Poppins, sans-serif' }}>
                            Change Profile Picture
                    </Card.Title>
                    
                    {/* Current Profile Photo */}
                    <Form.Label style={formLabelStyles}>Current Profile Picture:</Form.Label>
                    {profilePhotoUrl && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '20px', marginBottom: '20px' }}>
                            <img
                                src={profilePhotoUrl}
                                alt="Profile"
                                style={{ width: '400px', height: '400px', objectFit: 'cover', borderRadius: '0%' }}/>
                            <button
                                onClick={handleDeleteProfilePhoto}
                                style={{ position: 'relative', bottom: '180px', right: '30px', color: '#dcdcdc', fontSize: '20px', borderRadius: '50%', cursor: 'pointer' }}>
                            <IoMdClose />
                        </button>
                        </div>
                    )}
                    
                    <Form onSubmit={handleProfileSubmit}>
                        <Form.Group controlId="photoVideoFile">
                            <Form.Label style={formLabelStyles}>Upload New Profile Picture:</Form.Label>
                            <Form.Control
                                type="file"
                                name="profile_photo_filename"
                                onChange={handleProfileInputChange}
                                accept="image/*"
                                style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', display: 'block', width: '90%', marginLeft: '20px' }}/>
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3" style={{ paddingTop: '10px', paddingRight: '30px' }}>
                            <Button type="button" onClick={handleCancel} style={cancelButtonStyle}> Cancel </Button>
                            <Button type="submit"style={buttonStyle}> Update </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>


            {/* Password Change Form */}
            <Card style={{ boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', marginBottom: '20px', paddingBottom: '30px', maxHeight: '430px' }}>
                <Card.Body>
                    <Card.Title
                        style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px', fontWeight: '600', fontFamily: 'Poppins, sans-serif' }}>
                            Change Password
                    </Card.Title>
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="currentPassword">
                            <Form.Label style={formLabelStyles}>Current Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="current_password"
                                value={passwordFormData.current_password}
                                onChange={handlePasswordInputChange}
                                required
                                style={formControlStyles}
                            />
                        </Form.Group>
                        <Form.Group controlId="newPassword">
                            <Form.Label style={formLabelStyles}>New Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="new_password"
                                value={passwordFormData.new_password}
                                onChange={handlePasswordInputChange}
                                required
                                style={formControlStyles}
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmNewPassword">
                            <Form.Label style={formLabelStyles}>Confirm New Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirm_new_password"
                                value={passwordFormData.confirm_new_password}
                                onChange={handlePasswordInputChange}
                                required
                                style={formControlStyles}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end mt-3" style={{ paddingTop: '10px', paddingRight: '30px' }}>
                            <Button type="button" onClick={handleCancel} style={cancelButtonStyle}> Cancel </Button>
                            <Button type="submit"style={buttonStyle}> Update </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>;
            </div>

            {message && <p className="mt-3">{message}</p>} {/* Display message */}
        </div>
    );
}
