import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';

export default function ManageCategories() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token is missing or role_id is not '2', redirect to unauthorized page
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Render the component if token and role_id are valid
    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Categories</h6>
        </div>
    );
}
