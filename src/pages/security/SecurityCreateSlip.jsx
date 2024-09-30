import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const SecurityCreateSlip = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        student_idnumber: '',
        nature_id: '',
        photo_video_files: []
    });
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [filePreviews, setFilePreviews] = useState([]);
    const [violationOptions, setViolationOptions] = useState([]);

    // Fetch students and violation options on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:9000/students');
                const activeStudents = response.data.filter(student => student.status === 'active');
                const studentOptions = activeStudents.map(student => ({
                    value: student.student_idnumber,
                    label: `${student.student_idnumber} - ${student.first_name} ${student.middle_name} ${student.last_name} ${student.suffix}`
                }));
                setStudents(studentOptions);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        const fetchViolationOptions = async () => {
            try {
                const response = await axios.get('http://localhost:9000/violation-natures');
                const options = response.data.map(violation => ({
                    value: violation.nature_id,
                    label: violation.nature_name
                }));
                setViolationOptions(options);
            } catch (error) {
                console.error('Error fetching violation options:', error);
            }
        };

        fetchStudents();
        fetchViolationOptions();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'photo_video_files') {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...formData.photo_video_files, ...newFiles];
            setFormData({ ...formData, photo_video_files: updatedFiles });
            setFilePreviews(updatedFiles.map(file => URL.createObjectURL(file)));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        setFormData({ ...formData, [actionMeta.name]: selectedOption.value });
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...formData.photo_video_files];
        updatedFiles.splice(index, 1);
        setFormData({ ...formData, photo_video_files: updatedFiles });
        setFilePreviews(updatedFiles.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation before submission
        const result = await Swal.fire({
            title: 'Confirm Submission',
            text: "Are you sure you want to submit this slip?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('student_idnumber', formData.student_idnumber);
                formDataToSend.append('nature_id', formData.nature_id);

                formData.photo_video_files.forEach(file => {
                    formDataToSend.append('photo_video_files', file);
                });

                const employee_idnumber = localStorage.getItem('employee_idnumber');
                formDataToSend.append('submitted_by', employee_idnumber);

                const response = await axios.post('http://localhost:9000/create-uniformdefiance', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setMessage(response.data.message);

                Swal.fire({
                    icon: 'success',
                    title: 'Slip Submitted',
                    text: 'The uniform defiance slip has been submitted successfully.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/defiance-selection');
                });

                setFormData({
                    student_idnumber: '',
                    nature_id: '',
                    photo_video_files: []
                });
                setFilePreviews([]);
            } catch (error) {
                console.error('Error submitting form:', error);
                setMessage('An error occurred. Please try again later.');
            }
        }
    };

    const handleCancel = async () => {
        // Confirmation before canceling
        const result = await Swal.fire({
            title: 'Confirm Cancel',
            text: "Are you sure you want to cancel?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, go back'
        });

        if (result.isConfirmed) {
            navigate('/defiance-selection');
        }
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

                        <Form.Group controlId="natureId">
                            <Form.Label>Nature of Violation:</Form.Label>
                            <Select
                                options={violationOptions}
                                onChange={(option) => handleSelectChange(option, { name: 'nature_id' })}
                                placeholder="Select Nature of Violation"
                                isSearchable
                                value={violationOptions.find(option => option.value === formData.nature_id)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="photoVideoFiles">
                            <Form.Label>Upload Photos/Videos:</Form.Label>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {filePreviews.map((preview, index) => (
                                    <div key={index} style={fileTileStyle}>
                                        <img src={preview} alt={`preview-${index}`} style={filePreviewStyle} />
                                        <FaTimes
                                            onClick={() => handleRemoveFile(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                cursor: 'pointer',
                                                color: 'gray' // Changed to gray
                                            }}
                                        />
                                    </div>
                                ))}
                                <label htmlFor="file-upload" style={addFileTileStyle}>
                                    <FaPlus size={30} />
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    name="photo_video_files"
                                    onChange={handleInputChange}
                                    multiple
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </Form.Group>
                        <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
                        <Button variant="primary" type="submit" style={{ marginLeft: '10px' }}>Submit Slip</Button>
                    </Form>
                    {message && <p className="mt-3 text-center">{message}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default SecurityCreateSlip;
