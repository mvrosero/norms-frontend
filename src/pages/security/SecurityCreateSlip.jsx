import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SecurityCreateSlip = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        student_idnumber: '',
        violation_nature: '',
        photo_video_file: null
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        if (e.target.name === 'photo_video_file') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('student_idnumber', formData.student_idnumber);
            formDataToSend.append('violation_nature', formData.violation_nature);
            formDataToSend.append('photo_video_file', formData.photo_video_file);
    
            const response = await axios.post('http://localhost:9000/create-uniformdefiance', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            setMessage(response.data.message);
            setFormData({
                student_idnumber: '',
                violation_nature: '',
                photo_video_file: null
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };
    
    return (
        <div>
            <h2>Upload Uniform Defiance</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="studentId">
                    <Form.Label>Student ID Number:</Form.Label>
                    <Form.Control type="text" name="student_idnumber" value={formData.student_idnumber} onChange={handleInputChange} required />
                </Form.Group>

                <Form.Group controlId="violationNature">
                    <Form.Label>Violation Nature:</Form.Label>
                    <Form.Control type="text" name="violation_nature" value={formData.violation_nature} onChange={handleInputChange} required />
                </Form.Group>

                <Form.Group controlId="photoVideoFile">
                    <Form.Label>Upload Photo/Video:</Form.Label>
                    <Form.Control type="file" name="photo_video_file" onChange={handleInputChange} accept="image/*, video/*" required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default SecurityCreateSlip;
