import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

const SecurityCreateSlip = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        student_idnumber: '',
        violation_nature: '',
        photo_video_file: null
    });
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:9000/students');
                // Filter students with active status
                const activeStudents = response.data.filter(student => student.status === 'active');
                // Map students to match the format expected by react-select
                const studentOptions = activeStudents.map(student => ({
                    value: student.student_idnumber,
                    label: `${student.student_idnumber} - ${student.first_name} ${student.middle_name} ${student.last_name} ${student.suffix}`
                }));
                setStudents(studentOptions);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'photo_video_file') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, student_idnumber: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('student_idnumber', formData.student_idnumber);
            formDataToSend.append('violation_nature', formData.violation_nature);
            formDataToSend.append('photo_video_file', formData.photo_video_file);

            // Retrieve employee_idnumber from localStorage
            const employee_idnumber = localStorage.getItem('employee_idnumber');
            console.log('employee_idnumber from localStorage:', employee_idnumber);

            // Add employee_idnumber to formDataToSend
            formDataToSend.append('submitted_by', employee_idnumber);

            const response = await axios.post('http://localhost:9000/create-uniformdefiance', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
                }
            });

            console.log('Response:', response);
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

    const handleCancel = () => {
        navigate('/defiance-selection');
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h2 className="text-center">Upload Uniform Defiance</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="studentId">
                            <Form.Label>Student ID Number:</Form.Label>
                            <Select 
                                options={students} 
                                onChange={handleSelectChange} 
                                placeholder="Select Student" 
                                isSearchable 
                                value={students.find(option => option.value === formData.student_idnumber)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="violationNature">
                            <Form.Label>Violation Nature:</Form.Label>
                            <Form.Control type="text" name="violation_nature" value={formData.violation_nature} onChange={handleInputChange} required />
                        </Form.Group>

                        <Form.Group controlId="photoVideoFile">
                            <Form.Label>Upload Photo/Video:</Form.Label>
                            <Form.Control type="file" name="photo_video_file" onChange={handleInputChange} accept="image/*, video/*" required />
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

                    {message && <p className="text-center mt-3">{message}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default SecurityCreateSlip;
