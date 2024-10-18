import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Select from 'react-select'; // Import Select from react-select

const AddUniformDefianceModal = ({ show, handleCloseModal }) => {
    const { student_idnumber } = useParams(); // Get student_idnumber from URL
    const [formData, setFormData] = useState({
        student_idnumber: student_idnumber || '',
        description: '',
        category_id: '1', // Default to "Minor Offense"
        offense_id: '3', // Default to "Uniform and Dress Code Defiance"
        sanctions: [],  // Change from sanction_id to sanctions (array)
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
                const [categoriesResponse, offensesResponse, sanctionsResponse, academic_yearsResponse, semestersResponse] = await Promise.all([
                    axios.get('http://localhost:9000/categories'),
                    axios.get('http://localhost:9000/offenses'),
                    axios.get('http://localhost:9000/sanctions'),
                    axios.get('http://localhost:9000/academic_years'),
                    axios.get('http://localhost:9000/semesters'),
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

    const handleChange = ({ target: { name, value } }) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSanctionSelectChange = (selectedOptions) => {
        const selectedSanctions = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prevState => ({
            ...prevState,
            sanctions: selectedSanctions,
        }));
    };

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

        try {
            const response = await axios.post(`http://localhost:9000/create-violationrecord/${student_idnumber}`, { ...formData, sanctions });
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
                title: 'Error Creating Record',
                text: 'An error occurred while creating the violation record. Please try again later.',
            });
        }
    };

    return (
        <Modal show={show} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Uniform Defiance Record</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                />
                            </Form.Group>
                            <Form.Group controlId='description'>
                                <Form.Label className="fw-bold">Description</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    name='description' 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group controlId='acadyear_id'>
                                <Form.Label className="fw-bold">Academic Year</Form.Label>
                                <Form.Select
                                    name='acadyear_id' 
                                    value={formData.acadyear_id} 
                                    onChange={handleChange}
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
                                >
                                    <option value='1'>Minor Offense</option> {/* Default value */}
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
                                >
                                    <option value='3'>Uniform and Dress Code Defiance</option> {/* Default value */}
                                    {offenses.map((offense) => (
                                        <option key={offense.offense_id} value={offense.offense_id}>
                                            {offense.offense_name}
                                        </option>
                                    ))}
                                </Form.Select> 
                            </Form.Group>
                            {/* Sanctions Multi-Select */}
                            <Form.Group controlId='sanctions'>
                                <Form.Label className="fw-bold">Sanctions</Form.Label>
                                <Select
                                    isMulti
                                    name='sanctions'
                                    options={sanctions.map((sanction) => ({
                                        value: sanction.sanction_id,
                                        label: sanction.sanction_name,
                                    }))}
                                    onChange={handleSanctionSelectChange} // Handle multi-select changes
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                        <Button type="submit" variant="primary" className="me-2">
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddUniformDefianceModal;
