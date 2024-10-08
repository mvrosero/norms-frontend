import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function AddViolationRecordForm({ handleCloseModal }) {
    const { student_idnumber } = useParams(); // Get student_idnumber from URL
    const [formData, setFormData] = useState({
        student_idnumber: student_idnumber || '', // Initialize with URL parameter
        description: '',
        category_id: '',
        offense_id: '',
        sanction_id: '',
        acadyear_id: '',
        semester_id: '',
    });

    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academic_years, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('http://localhost:9000/categories');
                const offensesResponse = await axios.get('http://localhost:9000/offenses');
                const sanctionsResponse = await axios.get('http://localhost:9000/sanctions');
                const academic_yearsResponse = await axios.get('http://localhost:9000/academic_years');
                const semestersResponse = await axios.get('http://localhost:9000/semesters');

                setCategories(categoriesResponse.data);
                setOffenses(offensesResponse.data);
                setSanctions(sanctionsResponse.data);
                setAcademicYears(academic_yearsResponse.data);
                setSemesters(semestersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleCancel = () => {
        handleCloseModal();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            formData.student_idnumber === '' ||
            formData.description === '' ||
            formData.category_id === '' ||
            formData.offense_id === '' ||
            formData.sanction_id === '' ||
            formData.acadyear_id === '' ||
            formData.semester_id === ''
        ) {
            console.error('All fields are required.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:9000/create-violationrecord/${formData.student_idnumber}`, formData);
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Record Created Successfully!',
                text: 'Violation record has been created successfully.',
            });
            handleCloseModal();
        } catch (error) {
            console.error('Error creating violation record:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while creating violation record. Please try again later!',
            });
        }
    };

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',  // Ensure consistent height for all input fields
        width: '100%'   // Make input fields take the full width of the container
    };

    const buttonStyle = {
        backgroundColor: '#28a745',  // Change button color to green
        color: 'white',
        fontWeight: '600',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div className="violation-record-form-container">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={12}>
                        <Form.Group controlId='student_idnumber'>
                            <Form.Label className="fw-bold">Student ID Number</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='student_idnumber' 
                                value={formData.student_idnumber} 
                                readOnly
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='description' 
                                value={formData.description} 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        </Form.Group>
                        <Form.Group controlId='acadyear_id'>
                            <Form.Label className="fw-bold">Academic Year</Form.Label>
                            <Form.Select
                                name='acadyear_id' 
                                value={formData.acadyear_id} 
                                onChange={handleChange} 
                                style={inputStyle}>
                            
                                <option value=''>Select Academic Year</option>
                                    {academic_years.map((academic_year) => (
                                        <option key={academic_year.acadyear_id} value={academic_year.acadyear_id}>
                                            {academic_year.start_year} - {academic_year.end_year}
                                        </option>
                                    ))}
                                </Form.Select> 
                        </Form.Group>
                        <Form.Group controlId='semester_id'>
                            <Form.Label className="fw-bold">Semester</Form.Label>
                            <Form.Select
                                name='semester_id' 
                                value={formData.semester_id} 
                                onChange={handleChange} 
                                style={inputStyle}>
                            
                                <option value=''>Select Semester</option>
                                    {semesters.map((semester) => (
                                        <option key={semester.semester_id} value={semester.semester_id}>
                                            {semester.semester_name}
                                        </option>
                                    ))}
                                </Form.Select> 
                        </Form.Group>
                        <Form.Group controlId='category_id'>
                            <Form.Label className="fw-bold">Category</Form.Label>
                            <Form.Select
                                name='category_id' 
                                value={formData.category_id} 
                                onChange={handleChange} 
                                style={inputStyle}>
                            
                                <option value=''>Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </Form.Select> 
                        </Form.Group>
                        <Form.Group controlId='offense_id'>
                            <Form.Label className="fw-bold">Offense</Form.Label>
                            <Form.Select
                                name='offense_id' 
                                value={formData.offense_id} 
                                onChange={handleChange} 
                                style={inputStyle}>
                            
                                <option value=''>Select Offense</option>
                                    {offenses.map((offense) => (
                                        <option key={offense.offense_id} value={offense.offense_id}>
                                            {offense.offense_name}
                                        </option>
                                    ))}
                                </Form.Select> 
                        </Form.Group>
                        <Form.Group controlId='sanction_id'>
                            <Form.Label className="fw-bold">Sanction</Form.Label>
                            <Form.Select
                                name='sanction_id' 
                                value={formData.sanction_id} 
                                onChange={handleChange} 
                                style={inputStyle}>
                            
                                <option value=''>Select Sanction</option>
                                    {sanctions.map((sanction) => (
                                        <option key={sanction.sanction_id} value={sanction.sanction_id}>
                                            {sanction.sanction_name}
                                        </option>
                                    ))}
                                </Form.Select> 
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                    <Button type="submit" style={buttonStyle}>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}
