import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

export default function AddViolationRecordForm({ handleCloseModal }) {
    const [formData, setFormData] = useState({
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
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('http://localhost:9000/categories');
                const offensesResponse = await axios.get('http://localhost:9000/offenses');
                const sanctionsResponse = await axios.get('http://localhost:9000/sanctions');
                const academicYearsResponse = await axios.get('http://localhost:9000/academic_years');
                const semestersResponse = await axios.get('http://localhost:9000/semesters');

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

    const handleCancel = () => {
        handleCloseModal();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (

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
            const response = await axios.post('http://localhost:9000/create-violationrecord/:student_idnumber', formData);
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

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: 'auto', padding: '20px' }}
        >
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', width: '150px' }}>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e0e0e0' }}
                />
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', width: '150px' }}>Academic Year:</label>
                <select
                    name="acadyear_id"
                    value={formData.acadyear_id}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e0e0e0' }}
                >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((academicYear) => (
                        <option key={academicYear.acadyear_id} value={academicYear.acadyear_id}>
                            {academicYear.acadyear_name} {academicYear.semester}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', width: '150px' }}>Semester:</label>
                <select
                    name="semester_id"
                    value={formData.semester_id}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e0e0e0' }}
                >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                        <option key={semester.semester_id} value={semester.semester_id}>
                            {semester.semester_name}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', width: '150px' }}>Category:</label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e0e0e0' }}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', width: '150px' }}>Offense:</label>
                <select
                    name="offense_id"
                    value={formData.offense_id}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e0e0e0' }}
                >
                    <option value="">Select Offense</option>
                    {offenses.map((offense) => (
                        <option key={offense.offense_id} value={offense.offense_id}>
                            {offense.offense_name}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', width: '150px' }}>Sanction:</label>
                <select
                    name="sanction_id"
                    value={formData.sanction_id}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e0e0e0' }}
                >
                    <option value="">Select Sanction</option>
                    {sanctions.map((sanction) => (
                        <option key={sanction.sanction_id} value={sanction.sanction_id}>
                            {sanction.sanction_name}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </div>
        </form>
    );
}
