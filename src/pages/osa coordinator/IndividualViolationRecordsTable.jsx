import React from 'react';
import Table from 'react-bootstrap/Table';

const IndividualViolationRecordsTable = ({ records }) => {
    return (
        <Table bordered hover style={{ borderRadius: '20px' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                    <th>Record ID</th>
                    <th>User ID</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Created By</th>
                    <th>Category ID</th>
                    <th>Offense Name</th>
                    <th>Sanction ID</th>
                    <th>Academic Year ID</th>
                    <th>Semester ID</th>
                </tr>
            </thead>
            <tbody>
                {records.map((record, index) => (
                    <tr key={index}>
                        <td>{record.record_id}</td>
                        <td>{record.user_id}</td>
                        <td>{record.description}</td>
                        <td>{record.created_at}</td>
                        <td>{record.created_by}</td>
                        <td>{record.category_id}</td>
                        <td>{record.offense_name}</td>
                        <td>{record.sanction_id}</td>
                        <td>{record.acadyear_id}</td>
                        <td>{record.semester_id}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default IndividualViolationRecordsTable;
