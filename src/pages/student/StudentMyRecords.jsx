import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import MyRecordsTable from '../../elements/student/tables/MyRecordsTable';

const StudentMyRecords = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        }
    }, [navigate]);

    // Render null or a loading indicator until the redirection check is complete
    if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '3') {
        return null;
    }

    // Render the component if token and role_id are valid
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '30px' }}>
                    My Records
                </h6>
            </div>
            <StudentNavigation />
            <StudentInfo />
            <MyRecordsTable />
        </div>
    );
};

export default StudentMyRecords;
