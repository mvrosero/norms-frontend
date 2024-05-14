import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentAboutAndContact() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '3') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Render the component if token and role_id are valid
    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title"> ABOUT AND CONTACT </h6>
        </div>
    );
}
