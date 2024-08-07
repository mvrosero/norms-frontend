import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';


export default function ManageDepartments() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Render the component if token and role_id are valid
    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title"> Manage Departments </h6>
        </div>
    );
}

