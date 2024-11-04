import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const BatchEditStudentModal = ({ show, handleClose, studentIds }) => {
    const [yearLevel, setYearLevel] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [programId, setProgramId] = useState('');
    const [status, setStatus] = useState('');
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch departments and programs when the modal is opened
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departmentResponse, programResponse] = await Promise.all([
                    axios.get('http://localhost:9000/departments'),
                    axios.get('http://localhost:9000/programs'),
                ]);
                setDepartments(departmentResponse.data);
                setPrograms(programResponse.data);
            } catch (error) {
                console.error('Error fetching departments or programs:', error);
                setError('Failed to load departments or programs.');
            }
        };

        if (show) {
            fetchData();
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            // Prepare updates only for the fields that have been modified
            const updates = {
                ...(yearLevel && { year_level: yearLevel }),
                ...(departmentId && { department_id: departmentId }),
                ...(programId && { program_id: programId }),
                ...(status && { status: status }),
            };

            // Only send updates if there are any
            if (Object.keys(updates).length === 0) {
                setError('No fields to update.');
                return;
            }

            const payload = {
                student_ids: studentIds,
                updates: updates,
            };
            
            console.log('Request Payload:', payload); // Log the payload

            const response = await axios.put('http://localhost:9000/students', payload);

            setSuccessMessage(response.data.message); // Handle success message
            handleClose(); // Close modal after successful submission
            resetForm(); // Reset form fields after submission
        } catch (error) {
            console.error('Error updating students:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                setError(error.response.data.message || 'Failed to update students. Please try again.');
            } else {
                setError('Failed to update students. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setYearLevel('');
        setDepartmentId('');
        setProgramId('');
        setStatus('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>BATCH UPDATE STUDENTS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="year_level">
                        <Form.Label className="fw-bold">Year Level</Form.Label>
                        <Form.Select
                            name="year_level"
                            value={yearLevel}
                            onChange={(e) => setYearLevel(e.target.value)}
                        >
                            <option value="">Select Year Level</option>
                            <option value="First Year">First Year</option>
                            <option value="Second Year">Second Year</option>
                            <option value="Third Year">Third Year</option>
                            <option value="Fourth Year">Fourth Year</option>
                            <option value="Fifth Year">Fifth Year</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="department_id">
                        <Form.Label className="fw-bold">Department</Form.Label>
                        <Form.Select
                            name="department_id"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.department_id} value={department.department_id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="program_id">
                        <Form.Label className="fw-bold">Program</Form.Label>
                        <Form.Select
                            name="program_id"
                            value={programId}
                            onChange={(e) => setProgramId(e.target.value)}
                        >
                            <option value="">Select Program</option>
                            {programs.map((program) => (
                                <option key={program.program_id} value={program.program_id}>
                                    {program.program_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="status">
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BatchEditStudentModal;
