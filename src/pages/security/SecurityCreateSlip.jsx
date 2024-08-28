import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { FaPlus } from 'react-icons/fa';

const SecurityCreateSlip = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        student_idnumber: '',
        violation_nature: '',
        photo_video_files: []  // Changed to an array
    });
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [filePreviews, setFilePreviews] = useState([]);

    const violationOptions = [
        { value: 'Improper Uniform', label: 'Improper Uniform' },
        { value: 'No ID', label: 'No ID' },
        { value: 'Unauthorized Accessories', label: 'Unauthorized Accessories' },
        { value: 'Violation of Grooming Standards', label: 'Violation of Grooming Standards' },
        { value: 'Other', label: 'Other' }
    ];

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
        if (e.target.name === 'photo_video_files') {
            const files = Array.from(e.target.files);
            setFormData({ ...formData, [e.target.name]: files });
            setFilePreviews(files.map(file => URL.createObjectURL(file)));  // Generate file previews
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        setFormData({ ...formData, [actionMeta.name]: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('student_idnumber', formData.student_idnumber);
            formDataToSend.append('violation_nature', formData.violation_nature);

            // Append each file to formData
            formData.photo_video_files.forEach(file => {
                formDataToSend.append('photo_video_files', file);
            });

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
                photo_video_files: []  // Reset file inputs
            });
            setFilePreviews([]);  // Reset file previews
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleCancel = () => {
        navigate('/defiance-selection');
    };

    const fileTileStyle = {
        position: 'relative',
        width: '100px',
        height: '100px',
        margin: '5px',
        overflow: 'hidden',
        border: '2px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
    };

    const filePreviewStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    };

    const addFileTileStyle = {
        ...fileTileStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderStyle: 'dashed',
        backgroundColor: '#f8f9fa'
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
                                onChange={(option) => handleSelectChange(option, { name: 'student_idnumber' })} 
                                placeholder="Select Student" 
                                isSearchable 
                                value={students.find(option => option.value === formData.student_idnumber)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="violationNature">
                            <Form.Label>Nature of Violation:</Form.Label>
                            <Select 
                                options={violationOptions} 
                                onChange={(option) => handleSelectChange(option, { name: 'violation_nature' })} 
                                placeholder="Select Nature of Violation" 
                                isSearchable 
                                value={violationOptions.find(option => option.value === formData.violation_nature)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="photoVideoFiles">
                            <Form.Label>Upload Photos/Videos:</Form.Label>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {filePreviews.map((preview, index) => (
                                    <div key={index} style={fileTileStyle}>
                                        <img src={preview} alt={`preview ${index}`} style={filePreviewStyle} />
                                    </div>
                                ))}
                                <label htmlFor="fileInput" style={addFileTileStyle}>
                                    <FaPlus size={24} />
                                </label>
                                <Form.Control 
                                    id="fileInput"
                                    type="file" 
                                    name="photo_video_files" 
                                    onChange={handleInputChange} 
                                    accept="image/*, video/*" 
                                    multiple  // Allow multiple files
                                    style={{ display: 'none' }}  // Hide the default file input
                                    required 
                                />
                            </div>
                        </Form.Group>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>

                    {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default SecurityCreateSlip;
