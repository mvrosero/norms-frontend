import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentLegislations() {
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
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title"> LEGISLATIONS </h6>
        </div>
    );
}
