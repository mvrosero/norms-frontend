import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Assuming these are from 'react-pro-sidebar'

// Import navigation and info components
import AdminNavigation from '../administrator/AdminNavigation';
import AdminInfo from '../administrator/AdminInfo';
import CoordinatorNavigation from '../osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../osa coordinator/CoordinatorInfo';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';

export default function AccountSettings() {
    const navigate = useNavigate();
    const roleId = localStorage.getItem('role_id');

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');

        // If token is invalid or role_id is not one of the valid roles, redirect to unauthorized page
        if (!token || !['1', '2', '4'].includes(roleId)) {
            navigate('/unauthorized');
        }
    }, [navigate, roleId]);

    // Conditionally render the appropriate navigation and info components
    const renderNavigation = () => {
        switch (roleId) {
            case '1':
                return <><AdminNavigation /><AdminInfo /></>;
            case '2':
                return <><CoordinatorNavigation /><CoordinatorInfo /></>;
            case '4':
                return <><StudentNavigation /><StudentInfo /></>;
            default:
                return null;
        }
    };

    // Render the component if token and role_id are valid
    return (
        <div>
            {renderNavigation()}
            <h6 className="page-title">Account Settings</h6>
            {/* Add the rest of the account settings form here */}
        </div>
    );
}
