import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from '@emotion/styled';

const SecurityCreateSlip = () => {
    const [studentId, setStudentId] = useState('');
    const [violationNature, setViolationNature] = useState('');
    const [file, setFile] = useState(null);
    const [submittedBy, setSubmittedBy] = useState(''); // Replace with actual user ID
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('student_idnumber', studentId);
        formData.append('violation_nature', violationNature);
        formData.append('photo_video_filename', file);
        formData.append('submitted_by', submittedBy);

        try {
            await axios.post('http://localhost:9000/uniform_defiances', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/success'); // Adjust to your success page route
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const FormContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #f8f9fa;
        padding: 20px;
    `;

    const FormTitle = styled.h2`
        margin-bottom: 20px;
        color: #015901;
    `;

    return (
        <FormContainer>
            <Form onSubmit={handleSubmit} style={{ width: '400px' }}>
                <FormTitle>Create Uniform Defiance Slip</FormTitle>
                <Form.Group controlId="studentId">
                    <Form.Label>Student ID Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter student ID number"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="violationNature">
                    <Form.Label>Nature of Violation</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter nature of violation"
                        value={violationNature}
                        onChange={(e) => setViolationNature(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="file">
                    <Form.Label>Upload Photo/Video</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '20px', width: '100%' }}>
                    Submit
                </Button>
            </Form>
        </FormContainer>
    );
};

export default SecurityCreateSlip;
