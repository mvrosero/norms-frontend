import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

export default function CreateViolationModal({ handleCloseModal }) {
    const [formData, setFormData] = useState({
        user_id: '',
        description: '',
        category_id: '',
        offense_id: '',
        sanction_id: '',
        acadyear_id: '',
        semester_id: '',
    });

    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academic_years, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, categoriesResponse, offensesResponse, sanctionsResponse, academic_yearsResponse, semestersResponse] = await Promise.all([
                    axios.get('http://localhost:9000/students'),
                    axios.get('http://localhost:9000/categories'),
                    axios.get('http://localhost:9000/offenses'),
                    axios.get('http://localhost:9000/sanctions'),
                    axios.get('http://localhost:9000/academic_years'),
                    axios.get('http://localhost:9000/semesters')
                ]);

                setStudents(studentsResponse.data.filter(student => student.status === 'active'));
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            user_id: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.user_id ||
            !formData.description ||
            !formData.category_id ||
            !formData.offense_id ||
            !formData.sanction_id ||
            !formData.acadyear_id ||
            !formData.semester_id
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form',
                text: 'Please fill out all required fields.',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/create-violationrecord', formData);
            console.log(response.data);

            Swal.fire({
                icon: 'success',
                title: 'Record Created Successfully!',
                text: 'Violation record has been created successfully.',
            });

            if (typeof handleCloseModal === 'function') {
                handleCloseModal();
            } else {
                console.error('handleCloseModal is not a function');
            }
        } catch (error) {
            console.error('Error creating violation record:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while creating the violation record. Please try again later!',
            });
        }
    };

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    const buttonStyle = {
        backgroundColor: '#28a745',
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

    const studentOptions = students.map(student => ({
        value: student.user_id,
        label: student.student_idnumber
    }));

    return (
        <div className="violation-record-form-container">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={12}>
                        <Form.Group controlId='user_id'>
                            <Form.Label className="fw-bold">Student ID Number</Form.Label>
                            <Select
                                options={studentOptions}
                                value={studentOptions.find(option => option.value === formData.user_id)}
                                onChange={handleSelectChange}
                                placeholder="Select Student ID Number"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        width: '100%'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#f2f2f2',
                                        border: '1px solid #ced4da',
                                        borderRadius: '.25rem',
                                        height: '40px'
                                    })
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                style={inputStyle}
                                rows={3} // You can adjust the number of rows as needed
                            />
                        </Form.Group>
                        <Form.Group controlId='acadyear_id'>
                            <Form.Label className="fw-bold">Academic Year</Form.Label>
                            <Form.Select
                                name='acadyear_id'
                                value={formData.acadyear_id}
                                onChange={handleChange}
                                style={inputStyle}
                            >
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
                                style={inputStyle}
                            >
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
                                style={inputStyle}
                            >
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
                                style={inputStyle}
                            >
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
                                style={inputStyle}
                            >
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
