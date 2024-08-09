import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in local storage

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

    const [profileFormData, setProfileFormData] = useState({
        profile_photo_filename: null
    });
    const [passwordFormData, setPasswordFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [message, setMessage] = useState('');

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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('profile_photo_filename', profileFormData.profile_photo_filename);

            const response = await axios.post(`http://localhost:9000/upload-profile-photo/${userId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
                }
            });

            console.log('Response:', response);
            setMessage(response.data.message);
            setProfileFormData({
                profile_photo_filename: null
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Check if new password and confirmation match
        if (passwordFormData.new_password !== passwordFormData.confirm_new_password) {
            setMessage('New password and confirmation do not match.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:9000/password-change/${userId}`, {
                current_password: passwordFormData.current_password,
                new_password: passwordFormData.new_password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
                }
            });

            console.log('Password Change Response:', response);
            setMessage('Password changed successfully.');
            setPasswordFormData({
                current_password: '',
                new_password: '',
                confirm_new_password: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('An error occurred while changing the password.');
        }
    };

    const handleCancel = () => {
        navigate('/account-settings');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {renderNavigation()}
            <h2 className="text-center">ACCOUNT SETTINGS</h2>

            {/* Profile Photo Upload Form */}
            <Form onSubmit={handleProfileSubmit}>
                <Form.Group controlId="photoVideoFile">
                    <Form.Label>Upload Photo/Video:</Form.Label>
                    <Form.Control 
                        type="file" 
                        name="profile_photo_filename" 
                        onChange={handleProfileInputChange} 
                        accept="image/*, video/*" 
                        required 
                    />
                </Form.Group>

                <div className="d-flex justify-content-between mt-3">
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>

            {/* Password Change Form */}
            <Form onSubmit={handlePasswordSubmit} className="mt-4">
                <Form.Group controlId="currentPassword">
                    <Form.Label>Current Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="current_password"
                        value={passwordFormData.current_password}
                        onChange={handlePasswordInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="newPassword">
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="new_password"
                        value={passwordFormData.new_password}
                        onChange={handlePasswordInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="confirmNewPassword">
                    <Form.Label>Confirm New Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirm_new_password"
                        value={passwordFormData.confirm_new_password}
                        onChange={handlePasswordInputChange}
                        required
                    />
                </Form.Group>

                <div className="d-flex justify-content-between mt-3">
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>
                </div>
            </Form>

            {message && <p>{message}</p>} {/* Display message */}
        </div>
    );
}
