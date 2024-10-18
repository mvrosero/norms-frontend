import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

export default function CreateViolationModal({ handleCloseModal }) {
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
                    axios.get('http://localhost:9000/students'),
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
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Offense</Form.Label>
                        <Form.Select
                            name="offense_id"
                            value={formData.offense_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Offense</option>
                            {offenses.map((offense) => (
                                <option key={offense.offense_id} value={offense.offense_id}>
                                    {offense.offense_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

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

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Academic Year</Form.Label>
                        <Form.Select
                            name="acadyear_id"
                            value={formData.acadyear_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Year</option>
                            {academicYears.map((academic_year) => (
                                <option key={academic_year.acadyear_id} value={academic_year.acadyear_id}>
                                    {academic_year.start_year} - {academic_year.end_year}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Semester</Form.Label>
                        <Form.Select
                            name="semester_id"
                            value={formData.semester_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Semester</option>
                            {semesters.map((semester) => (
                                <option key={semester.semester_id} value={semester.semester_id}>
                                    {semester.semester_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}
