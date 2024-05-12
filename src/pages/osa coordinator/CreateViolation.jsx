import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CreateViolationRecordForm({ handleCloseModal }) {
    const [formData, setFormData] = useState({
        user_id: '',
        description: '',
        acadyear_id: '',
        semester_id: '',
        category_id: '',
        offense_id: '',
        sanction_id: ''
    });
    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academic_years, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        // Fetch data for students, categories, offenses, and sanctions
        const fetchData = async () => {
            try {
                const studentsResponse = await axios.get('http://localhost:9000/students');
                const categoriesResponse = await axios.get('http://localhost:9000/categories');
                const offensesResponse = await axios.get('http://localhost:9000/offenses');
                const sanctionsResponse = await axios.get('http://localhost:9000/sanctions');
                const academic_yearsResponse = await axios.get('http://localhost:9000/academic_years');
                const semestersResponse = await axios.get('http://localhost:9000/semesters');
                setStudents(studentsResponse.data);
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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/violation-record', formData);
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Record Created Successfully!',
                text: 'Violation record has been created successfully.',
            });
            handleCloseModal(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error creating violation record:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while creating violation record. Please try again later!',
            });
        }
    };

    /*Create Violation Record Form*/
        return (
            <div className="violation-record-form-container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Student ID Number:</label>
                        <select name="user_id" value={formData.user_id} onChange={handleChange} required>
                            <option value="">Select User</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>{student.student_idnumber}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Academic Year:</label>
                        <select name="acadyear_id" value={formData.acadyear_id} onChange={handleChange} required>
                            <option value="">Select Academic Year</option>
                            {academic_years.map(academic_year => (
                                <option key={academic_year.acadyear_id} value={academic_year.acadyear_id}>{academic_year.acadyear_name} {academic_year.semester}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Semester:</label>
                        <select name="semester_id" value={formData.semester_id} onChange={handleChange} required>
                            <option value="">Select Semester</option>
                            {semesters.map(semester => (
                                <option key={semester.semester_id} value={semester.semester_id}>{semester.semester_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Category:</label>
                        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Offense:</label>
                        <select name="offense_id" value={formData.offense_id} onChange={handleChange} required>
                            <option value="">Select Offense</option>
                            {offenses.map(offense => (
                                <option key={offense.offense_id} value={offense.offense_id}>{offense.offense_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Sanction:</label>
                        <select name="sanction_id" value={formData.sanction_id} onChange={handleChange} required>
                            <option value="">Select Sanction</option>
                            {sanctions.map(sanction => (
                                <option key={sanction.sanction_id} value={sanction.sanction_id}>{sanction.sanction_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="buttons">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            style={{
                                backgroundColor: '#8C8C8C',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            style={{
                                backgroundColor: '#FAD32E',
                                color: '#000',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer'
                            }}
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>
        );
}
