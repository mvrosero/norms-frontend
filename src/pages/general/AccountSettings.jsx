import React from 'react';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from '../administrator/AdminNavigation';
import AdminInfo from '../administrator/AdminInfo';
import CoordinatorNavigation from '../osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../osa coordinator/CoordinatorInfo';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';

export default function AccountSettings() {
    const navigate = useNavigate();
    const roleId = localStorage.getItem('role_id');

    const renderNavigation = () => {
        switch (roleId) {
            case '1':
                return <><AdminNavigation /><AdminInfo /></>;
            case '2':
                return <><CoordinatorNavigation /><CoordinatorInfo /></>;
            case '3':
                return <><StudentNavigation /><StudentInfo /></>;
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {renderNavigation()}
        </div>
    );
}
