import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

export default function DepartmentalCreateViolationModal({ handleCloseModal }) {
    const [formData, setFormData] = useState({
        description: '',
        category_id: '',
        offense_id: '',
        users: [], // Multi-select field for user IDs
        sanctions: [], // Multi-select field for sanction IDs
        acadyear_id: '',
        semester_id: '',
    });

    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

        // Fetching data from backend
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const [
                        studentsResponse,
                        categoriesResponse,
                        offensesResponse,
                        sanctionsResponse,
                        academicYearsResponse,
                        semestersResponse,
                    ] = await Promise.all([
                        axios.get(`http://localhost:9000/students`), // Fetch students
                        axios.get('http://localhost:9000/categories'),
                        axios.get('http://localhost:9000/offenses'),
                        axios.get('http://localhost:9000/sanctions'),
                        axios.get('http://localhost:9000/academic_years'),
                        axios.get('http://localhost:9000/semesters'),
                    ]);
    
                    setStudents(studentsResponse.data.filter((student) => student.status === 'active'));
                    setCategories(categoriesResponse.data);
                    setOffenses(offensesResponse.data);
                    setSanctions(sanctionsResponse.data);
                    setAcademicYears(academicYearsResponse.data);
                    setSemesters(semestersResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
    
            fetchData();
        }, []);


    // Handling input change for non-select inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    // Handling multi-select field changes
    const handleSelectChange = (selectedOptions, { name }) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        }));
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:9000/create-violationrecord', formData);
            Swal.fire('Success', 'Violation record created successfully!', 'success');
            handleCloseModal();
        } catch (error) {
            console.error('Error creating violation record:', error);
            Swal.fire('Error', 'Failed to create violation record.', 'error');
        }
    };


    return (
            <Form onSubmit={handleSubmit}>
            {/* Users */}
            <Form.Group className="mb-3">
                <Form.Label>Users</Form.Label>
                <Select
                    isMulti
                    name="users"
                    options={students.map((student) => ({
                        value: student.user_id,
                        label: `${student.first_name} ${student.last_name}`,
                    }))}
                    onChange={handleSelectChange}
                    required
                />
            </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Academic Year</Form.Label>
                            <Form.Select
                                name="acadyear_id"
                                value={formData.acadyear_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Year</option>
                                {academicYears.map(year => (
                                    <option key={year.acadyear_id} value={year.acadyear_id}>
                                        {year.start_year} - {year.end_year}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Semester</Form.Label>
                            <Form.Select
                                name="semester_id"
                                value={formData.semester_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Semester</option>
                                {semesters.map(sem => (
                                    <option key={sem.semester_id} value={sem.semester_id}>
                                        {sem.semester_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Category</Form.Label>
                            <Form.Select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Offense</Form.Label>
                            <Form.Select
                                name="offense_id"
                                value={formData.offense_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Offense</option>
                                {offenses.map(off => (
                                    <option key={off.offense_id} value={off.offense_id}>
                                        {off.offense_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>


            {/* Sanction */}
            <Form.Group className="mb-3">
                <Form.Label>Sanctions</Form.Label>
                <Select
                    isMulti
                    name="sanctions"
                    options={sanctions.map((sanction) => ({
                        value: sanction.sanction_id,
                        label: sanction.sanction_name,
                    }))}
                    onChange={handleSelectChange}
                    required
                />
            </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
    );
}
