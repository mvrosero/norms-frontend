// IndividualUniformDefianceTable.js
import React from 'react';
import { Table } from 'react-bootstrap';
import { format } from 'date-fns';

const IndividualUniformDefianceTable = ({ defiances, employees, handleShowDetailsModal }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'MM-dd-yyyy, HH:mm:ss');
    };

    return (
        <Table bordered hover style={{ borderRadius: '20px', marginTop: '20px' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th>Created At</th>
                    <th>Nature of Violation</th>
                    <th>File Attached</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {defiances.map((defiance) => (
                    <tr key={defiance.slip_id}> {/* Use a unique identifier */}
                        <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                        <td>{formatDate(defiance.created_at)}</td>
                        <td>{defiance.nature_name}</td>
                        <td>
                            <div 
                                className="d-flex align-items-center" 
                                style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }} 
                                onClick={() => handleShowDetailsModal(defiance)}
                            >
                                View
                            </div>
                        </td>
                        <td>{defiance.status}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default IndividualUniformDefianceTable;
