import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Select from 'react-select'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import '../../../styles/style.css'

const AddUniformDefianceModal = ({ show, onHide, handleCloseModal }) => {
    const { student_idnumber } = useParams(); 
    const [formData, setFormData] = useState({
        student_idnumber: student_idnumber || '',
        description: '',
        category_id: '',
        offense_id: '3', 
        sanctions: [],  
        acadyear_id: '',
        semester_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academic_years, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [focusedElement, setFocusedElement] = useState(null);


    // Maximum text area length 
    const maxLength = 5000;
    const currentLength = formData.description.length;

    // Handle the focus state for both text area and semester select
    const handleFocus = (element) => {
        setFocusedElement(element); 
    };

    const handleBlur = () => {
        setFocusedElement(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, offensesResponse, sanctionsResponse, academic_yearsResponse, semestersResponse] = await Promise.all([
                    axios.get('https://test-backend-api-2.onrender.com/categories'),
                    axios.get('https://test-backend-api-2.onrender.com/offenses'),
                    axios.get('https://test-backend-api-2.onrender.com/sanctions'),
                    axios.get('https://test-backend-api-2.onrender.com/academic_years'),
                    axios.get('https://test-backend-api-2.onrender.com/semesters'),
                ]);

                setCategories(categoriesResponse.data || []);
                setOffenses(offensesResponse.data || []);
                setSanctions(sanctionsResponse.data || []);
                setAcademicYears(academic_yearsResponse.data || []);
                setSemesters(semestersResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Data Fetch Error',
                    text: 'Unable to load data. Please check your connection.',
                });
            }
        };
        fetchData();
    }, []);


    // Handle input change for non-select inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle multi-select field changes
    const handleSelectChange = (selectedOptions, { name }) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        }));
    };


    // Handle the add violation record
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { student_idnumber, description, category_id, offense_id, sanctions, acadyear_id, semester_id } = formData;
    
        if (!student_idnumber || !description || !category_id || !offense_id || sanctions.length === 0 || !acadyear_id || !semester_id) {
            Swal.fire({
                icon: 'warning',
                title: 'Form Incomplete',
                text: 'Please fill in all fields before submitting.',
            });
            return;
        }
        Swal.fire({
            title: 'Are you sure you want to record this violation?',
            text: 'You are about to create a new violation record.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, record it',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(`https://test-backend-api-2.onrender.com/create-violationrecord/${student_idnumber}`, { ...formData, sanctions });
                    console.log(response.data);
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Record Created Successfully!',
                        text: 'Violation record has been created successfully.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    setFormData({
                        student_idnumber: student_idnumber,
                        description: '',
                        category_id: '',
                        offense_id: offense_id,
                        sanctions: [],
                        acadyear_id: '',
                        semester_id: '',
                    });
    
                    handleCloseModal();
                } catch (error) {
                    console.error('Error creating violation record:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Creating Record',
                        text: 'An error occurred while creating the violation record. Please try again later.',
                    });
                }
            }
        });
    };
    

    // Handle the cancel violation record
    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: 'Any unsaved changes will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, close it',
            cancelButtonText: 'No, keep changes',
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData((prevData) => ({
                    ...prevData,
                    description: '',
                    category_id: '',
                    offense_id: '',
                    users: [],
                    sanctions: [],
                    acadyear_id: '',
                    semester_id: '',
                }));
                setIsFocused(false);
                setFocusedElement(null);
                onHide();
            }
        });
    };


    // Handle the field styles
    const regularSelectStyles = {
        backgroundColor: '#f2f2f2',
        borderRadius: '4px',
        padding: '6px',
        outline: 'none',
    };

    const borderColorStyles = (focusedElement, element) => ({
        border: `1px solid ${focusedElement === element ? '#FAD32E' : '#ced4da'}`, 
        boxShadow: focusedElement === element ? '0 0 0 2px rgba(250, 211, 46, 1)' : 'none', 
    });

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#f2f2f2',
            border: `1px solid ${state.isFocused ? '#FAD32E' : '#ced4da'}`, 
            borderRadius: '4px',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(250, 211, 46, 1)' : 'none', 
            outline: 'none', 
            borderColor: state.isFocused ? '#FAD32E !important' : '#ced4da', 
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#FAD32E' : state.isFocused ? '#f0f0f0' : null,
            color: state.isSelected ? 'white' : 'black',
            padding: '10px',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#CFCFCF', 
            color: '#fff',
            borderRadius: '10px',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            backgroundColor: 'transparent', 
            color: '#777777', 
        }),
    };


return (
        <Modal show={show} onHide={handleCancel} size="lg">
            <Modal.Header>
                <Button variant="link" onClick={handleCancel} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }} >
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}> ADD VIOLATION RECORD </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <form onSubmit={handleSubmit}>
                <Row className="gy-4">
                        <Form.Group className="student_idnumber mb-3">
                            <Form.Label className="fw-bold">Student ID Number</Form.Label>
                            <Form.Control
                                name="student_idnumber"
                                type='text' 
                                value={formData.student_idnumber} 
                                readOnly 
                                style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da', borderRadius: '4px', padding: '8px'}} >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Col md={6}>
                        <Form.Group className="academic_year mb-3">
                            <Form.Label className="fw-bold">Academic Year</Form.Label>
                            <Form.Select
                                name="acadyear_id"
                                value={formData.acadyear_id}
                                onChange={handleChange}
                                required
                                onFocus={() => handleFocus('academic_year')} 
                                onBlur={handleBlur} 
                                style={{
                                    ...regularSelectStyles,
                                    ...borderColorStyles(focusedElement, 'academic_year'), 
                                }}
                            >
                                <option disabled value="">Select Academic Year</option>
                                {academic_years.map((year) => (
                                    <option key={year.acadyear_id} value={year.acadyear_id}>
                                        {year.start_year} - {year.end_year}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="semester mb-3">
                            <Form.Label className="fw-bold">Select Semester</Form.Label>
                            <Form.Select
                                name="semester_id"
                                value={formData.semester_id}
                                onChange={handleChange}
                                required
                                onFocus={() => handleFocus('semester')} 
                                onBlur={handleBlur} 
                                style={{
                                    ...regularSelectStyles,
                                    ...borderColorStyles(focusedElement, 'semester'), 
                                }}
                            >
                                <option disabled value="">Select Semester</option>
                                {semesters.map((sem) => (
                                    <option key={sem.semester_id} value={sem.semester_id}>
                                        {sem.semester_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group className="category mb-3">
                            <Form.Label className="fw-bold">Category</Form.Label>
                            <Form.Select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                onFocus={() => handleFocus('category')} 
                                onBlur={handleBlur} 
                                style={{
                                    ...regularSelectStyles,
                                    ...borderColorStyles(focusedElement, 'category'), 
                                }}
                            >
                                <option disabled value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>  
                    </Row>

                    <Row className="gy-4">
                        <Form.Group className="offense mb-3">
                            <Form.Label className="fw-bold">Offense</Form.Label>
                            <Form.Control
                                name="offense_id"
                                value="Incomplete and improper use of uniform or wearing an attire not befitting the school’s dress code policy, and non-wearing of ID"  
                                readOnly  
                                style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da', borderRadius: '4px', padding: '6px'}} />
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group className="sanctions mb-3">
                            <Form.Label className="fw-bold">Sanctions</Form.Label>
                            <Select
                                isMulti
                                name="sanctions"
                                options={sanctions.map((sanction) => ({
                                    value: sanction.sanction_id,
                                    label: sanction.sanction_name,
                                }))}
                                onChange={handleSelectChange}
                                required
                                styles={customSelectStyles}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group className="desscription mb-3" style={{ marginBottom: '20px' }}>
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <ReactQuill
                                theme="snow" 
                                value={formData.description}
                                onChange={(description) => handleChange({ target: { name: 'description', value: description.trim() } })}
                                onFocus={() => setFocusedElement('description')}
                                onBlur={() => setFocusedElement(null)}
                                formats={[ 'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'ordered' ]}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ['bold', 'italic', 'underline'],
                                        [{ list: 'ordered' }, { list: 'bullet' }]
                                    ],
                                }}
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '10px',
                                    backgroundColor: '#f2f2f2',
                                    border: `1px solid ${focusedElement === 'description' ? '#FAD32E' : '#ced4da'}`, 
                                    borderRadius: '4px',
                                    boxShadow: focusedElement === 'description' ? '0 0 0 2px rgba(250, 211, 46, 1)' : 'none',
                                }}
                            />
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                {formData.description.length}/{maxLength}
                            </div>
                        </Form.Group>
                    </Row>

                    <Row className="gy-4">
                        <Form.Group className="description mb-3" style={{ marginBottom: '20px' }}>
                            <Form.Label className="fw-bold">Description</Form.Label>
                                <div style={{ position: 'relative' }}>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    maxLength={maxLength}
                                    onFocus={() => handleFocus('description')} 
                                    onBlur={handleBlur} 
                                    style={{
                                        width: '100%',
                                        minHeight: '100px',
                                        padding: '10px',
                                        backgroundColor: '#f2f2f2',
                                        border: `1px solid ${focusedElement === 'description' ? '#FAD32E' : '#ced4da'}`, 
                                        borderRadius: '4px',
                                        boxShadow: focusedElement === 'description' ? '0 0 0 2px rgba(250, 211, 46, 1)' : 'none',
                                    }}
                                />
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '12px', color: '#666' }}> {currentLength}/{maxLength} </div>
                            </div>
                        </Form.Group>
                    </Row>
                        {/* Buttons */}
                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" onClick={handleCancel} className='modal-cancel-button'>
                                Cancel
                            </button>
                            <button type="submit" className='modal-save-button'>
                                Save
                            </button>
                        </div>
                    </form>         
            </Modal.Body>
        </Modal>
    );
};


export default AddUniformDefianceModal;
