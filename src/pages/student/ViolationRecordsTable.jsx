import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const MyRecordsTable = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        // Fetch records data from the backend
        const fetchRecords = async () => {
            try {
                const response = await axios.get('http://localhost:9000/violation_record/:id');
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        fetchRecords();
    }, []);

    return (
        <>
            {/* Violation records table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Record ID</th>
                        <th>Violation Type</th>
                        <th>Description</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.record_id}>
                            <td>{record.record_id}</td>
                            <td>{record.violation_type}</td>
                            <td>{record.description}</td>
                            <td>{record.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default MyRecordsTable;
