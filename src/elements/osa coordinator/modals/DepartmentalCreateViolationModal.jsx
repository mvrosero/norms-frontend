import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

export default function DepartmentalCreateViolationModal({ handleCloseModal, department_code }) {
    const [formData, setFormData] = useState({
        description: '',
        category_id: '',
        offense_id: '',
        users: [], // Multi-select field for user IDs
        sanctions: [], // Multi-select field for sanction IDs
        acadyear_id: '',
        semester_id: '',
        department_code: department_code,
    });

    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, categoriesResponse, offensesResponse, sanctionsResponse, academicYearsResponse, semestersResponse] = await Promise.all([
                    axios.get(`http://localhost:9000/students/${department_code}`), // Fetch students by department_code
                    axios.get('http://localhost:9000/categories'),
                    axios.get('http://localhost:9000/offenses'),
                    axios.get('http://localhost:9000/sanctions'),
                    axios.get('http://localhost:9000/academic_years'),
                    axios.get('http://localhost:9000/semesters'),
                ]);

                setStudents(studentsResponse.data.filter(student => student.status === 'active'));
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
    }, [department_code]); // Include department_code as a dependency

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (selectedOptions, { name }) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.description ||
            !formData.category_id ||
            !formData.offense_id ||
            formData.users.length === 0 ||
            formData.sanctions.length === 0 ||
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

    const studentOptions = students.map(student => ({
        value: student.user_id,
        label: `${student.first_name} ${student.last_name}`,
    }));

    const sanctionOptions = sanctions.map(sanction => ({
        value: sanction.sanction_id,
        label: sanction.sanction_name,
    }));

    return (
        <div className="violation-record-form-container">
            <Form onSubmit={handleSubmit}>
                {/* Users */}
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Users</Form.Label>
                    <Select
                        isMulti
                        name="users"
                        options={studentOptions}
                        onChange={handleSelectChange}
                        placeholder="Select Students"
                        required
                    />
                </Form.Group>

                {/* Academic Year and Semester */}
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Academic Year</Form.Label>
                            <Form.Select
                                name="acadyear_id"
                                value={formData.acadyear_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                {academicYears.map(academic_year => (
                                    <option key={academic_year.acadyear_id} value={academic_year.acadyear_id}>
                                        {academic_year.start_year} - {academic_year.end_year}
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
                                required
                            >
                                <option value="">Select Semester</option>
                                {semesters.map(semester => (
                                    <option key={semester.semester_id} value={semester.semester_id}>
                                        {semester.semester_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Category */}
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Category</Form.Label>
                            <Form.Select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Offense */}
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Offense</Form.Label>
                            <Form.Select
                                name="offense_id"
                                value={formData.offense_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Offense</option>
                                {offenses.map(offense => (
                                    <option key={offense.offense_id} value={offense.offense_id}>
                                        {offense.offense_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Sanctions */}
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sanctions</Form.Label>
                    <Select
                        isMulti
                        name="sanctions"
                        options={sanctionOptions}
                        onChange={handleSelectChange}
                        required
                    />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
