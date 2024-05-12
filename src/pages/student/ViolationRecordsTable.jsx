import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';

const MyRecordsTable = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const studentIdNumber = localStorage.getItem('student_idnumber');
                if (!studentIdNumber) {
                    throw new Error('Student ID number not found in local storage');
                }

                const response = await axios.get(`http://localhost:9000/myrecords/${studentIdNumber}`);
                setRecords(response.data);
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    return (
        <>
            {loading && <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Table bordered hover style={{ borderRadius: '20px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th>Record ID</th>
                            <th>User ID</th>
                            <th>Created At</th>
                            <th>Category ID</th>
                            <th>Offense Name</th>
                            <th>Sanction ID</th>
                            <th>Academic Year ID</th>
                            <th>Semester ID</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(record => (
                            <tr key={record.record_id}>
                                <td>{record.record_id}</td>
                                <td>{record.user_id}</td>
                                <td>{record.created_at}</td>
                                <td>{record.category_id}</td>
                                <td>{record.offense_id}</td>
                                <td>{record.sanction_id}</td>
                                <td>{record.acadyear_id}</td>
                                <td>{record.semester_id}</td>
                                <td>{record.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default MyRecordsTable;
