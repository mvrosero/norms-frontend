import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import { IoMdAttach } from "react-icons/io";
import Swal from 'sweetalert2';
import '../../styles/style.css';

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
    const [isFocused, setIsFocused] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(students.slice(0, 10)); 


    // Filter to only display 10 students on the dropdown options
    const handleSearch = (inputValue) => {
        if (inputValue) {
            const filtered = students.filter((student) =>
                student.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(students.slice(0, 10)); 
        }
    };


    // Fetch students and violation options
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://test-backend-api-2.onrender.com/students');
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


        // Fetch nature of violation
        const fetchViolationOptions = async () => {
            try {
                const response = await axios.get('https://test-backend-api-2.onrender.com/violation-natures');
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


    // Handle file removal
    const handleRemoveFile = (index) => {
        const updatedFiles = [...formData.photo_video_files];
        updatedFiles.splice(index, 1);
        setFormData({ ...formData, photo_video_files: updatedFiles });
        setFilePreviews(updatedFiles.map(file => URL.createObjectURL(file)));
    };


    // Handle the submit uniform defiance slip
    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Are you sure you want to create this uniform defiance?',
            text: "You are about to create a new uniform defiance slip.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, create it',
            cancelButtonText: 'Cancel',
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
                const response = await axios.post('https://test-backend-api-2.onrender.com/create-uniformdefiance', formDataToSend, {
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
            
                if (error.response) {
                    setMessage(`Error: ${error.response.data.error || error.response.statusText}`);
                } else if (error.message) {
                    setMessage(`Error: ${error.message}`);
                } else {
                    setMessage('An unexpected error occurred. Please try again later.');
                }
            
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an error submitting the form. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };


    // Handle the cancel uniform defiance slip
    const handleCancel = async () => {
        const result = await Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: 'Any unsaved changes will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, close it!',
            cancelButtonText: 'No, keep changes',
        });

        if (result.isConfirmed) {
            navigate('/defiance-selection');
        }
    };


    // Set the styles for the file tile
    const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? '1px solid #0D4809' : '1px solid #ced4da', 
        boxShadow: state.isFocused ? '0 0 0 1px #0D4809' : 'none', 
        '&:hover': {
        borderColor: state.isFocused ? '#0D4809' : '#ced4da', 
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#fff', 
        zIndex: 9999, 
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#0D4809' : '#fff', 
        color: state.isSelected ? '#fff' : '#333', 
        '&:hover': {
        backgroundColor: '#f4f4f4', 
        },
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#333',
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
      }),
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
    <div className="create-slip-group">
        <div className="create-slip-container1">
            <h1>Uniform Defiance Slip</h1>
        </div>

        <div className="create-slip-container2">
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="studentId">
                    <div className="row align-items-center" style={{ marginBottom: '30px' }}>
                        <div className="col-4">
                            <Form.Label className="fw-bold">Student ID Number:</Form.Label>
                        </div>
                        <div className="col-8">
                            <Select
                                options={filteredOptions} 
                                onChange={(option) => handleSelectChange(option, { name: 'student_idnumber' })}
                                placeholder="Select Student"
                                isSearchable
                                value={students.find((option) => option.value === formData.student_idnumber)}
                                required
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onInputChange={handleSearch} 
                                styles={customStyles} 
                                className={`${isFocused ? 'create-slip-focused-select' : 'create-slip-default-select'} create-slip-regular-select`}
                            />
                        </div>
                    </div>
                </Form.Group>

                <Form.Group controlId="natureId">
                    <div className="row align-items-center" style={{ marginBottom: '30px' }}>
                        <div className="col-4"> <Form.Label className="fw-bold">Nature of Violation:</Form.Label> </div>
                            <div className="col-8">
                                <Select
                                    options={violationOptions}
                                    onChange={(option) => handleSelectChange(option, { name: 'nature_id' })}
                                    placeholder="Select Nature of Violation"
                                    isSearchable
                                    value={violationOptions.find((option) => option.value === formData.nature_id)}
                                    required
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    styles={customStyles} 
                                    className={`${isFocused ? 'create-slip-focused-select' : 'create-slip-default-select'} create-slip-regular-select`}
                                />
                            </div>
                    </div>
                </Form.Group>

                <Form.Group controlId="photoVideoFiles">
                    <div className="row align-items-center" style={{ marginBottom: '30px' }}>
                        <div className="col-4"> <Form.Label className="fw-bold">Proof of Defiance:</Form.Label> </div>
                            <div className="col-8">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {filePreviews.map((preview, index) => (
                                    <div key={index} style={fileTileStyle}>
                                        <img src={preview} alt={`preview-${index}`} style={filePreviewStyle} />
                                        <FaTimes onClick={() => handleRemoveFile(index)}
                                        style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', color: 'gray' }}/>
                                    </div>
                                ))}
                                <label htmlFor="file-upload" style={addFileTileStyle}>
                                    <IoMdAttach style={{ fontSize: '30px', color: 'gray' }} />
                                </label>
                                <input id="file-upload" type="file" name="photo_video_files" onChange={handleInputChange} multiple style={{ display: 'none' }}/>
                            </div>
                                <small className="text-muted mt-1 d-block">
                                    Only photo and video attachments are allowed. File size should not exceed 10 MB.
                                </small>
                        </div>
                    </div>
                </Form.Group>
                    {/* Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} className="mt-3">
                        <button type="button" className="create-slip-cancel-button" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="create-slip-submit-button">Save</button>
                    </div>
            </Form>
        </div>
    </div>
    );
};


export default SecurityCreateSlip;
