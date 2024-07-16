import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from '@emotion/styled';
const SecurityCreateSlip = () => {
    const [formData, setFormData] = useState({
        student_idnumber: '',
        violation_nature: '',
        submitted_by: '',
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
            formDataToSend.append('submitted_by', formData.submitted_by);
            formDataToSend.append('photo_video_file', formData.photo_video_file);

            const response = await axios.post('http://localhost:9000/create-uniformdefiance', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            // Optionally reset the form after successful submission
            setFormData({
                student_idnumber: '',
                violation_nature: '',
                submitted_by: '',
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
            <form onSubmit={handleSubmit}>
                <label htmlFor="studentId">Student ID Number:</label>
                <input type="text" id="studentId" name="student_idnumber" value={formData.student_idnumber} onChange={handleInputChange} required /><br /><br />

                <label htmlFor="violationNature">Violation Nature:</label>
                <input type="text" id="violationNature" name="violation_nature" value={formData.violation_nature} onChange={handleInputChange} required /><br /><br />

                <label htmlFor="submittedBy">Submitted By:</label>
                <input type="text" id="submittedBy" name="submitted_by" value={formData.submitted_by} onChange={handleInputChange} required /><br /><br />

                <label htmlFor="photoVideoFile">Upload Photo/Video:</label>
                <input type="file" id="photoVideoFile" name="photo_video_file" onChange={handleInputChange} accept="image/*, video/*" required /><br /><br />

                <button type="submit">Submit</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};


export default SecurityCreateSlip;
