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

    const [formData, setFormData] = useState({
        profile_photo_filename: null
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        if (e.target.name === 'profile_photo_filename') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('profile_photo_filename', formData.profile_photo_filename);

            const response = await axios.post(`http://localhost:9000/upload-profile-photo/${userId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
                }
            });

            console.log('Response:', response);
            setMessage(response.data.message);
            setFormData({
                profile_photo_filename: null
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleCancel = () => {
        navigate('/account-settings');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {renderNavigation()}
            <h2 className="text-center">ACCOUNT SETTINGS</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="photoVideoFile">
                    <Form.Label>Upload Photo/Video:</Form.Label>
                    <Form.Control 
                        type="file" 
                        name="profile_photo_filename" 
                        onChange={handleInputChange} 
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
            {message && <p>{message}</p>} {/* Display message */}
        </div>
    );
}
