import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faBuilding, faBook, faCalendarAlt, faChevronRight, faTags, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';

export default function CoordinatorSettings() {
    const navigate = useNavigate();
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);


    const handleNavigation = (path) => {
        const fullPath = path === '/account-settings' && user_id ? `${path}/${user_id}` : path;
        navigate(fullPath);
    };

    const containerStyle = {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '10px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        marginBottom: '10px',
        height: '80px',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center', 
    };

    const containerHoverStyle = {
        backgroundColor: '#e2e6ea',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    const iconContainerStyle = {
        width: '50px', 
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: '20px',  
        marginRight: '20px', 
    };

    const textStyle = {
        fontSize: '20px',
        fontWeight: '500',
        color: '#1b1c1e',
        marginLeft: '10px',  
        flex: 1, 
    };

    const arrowStyle = {
        fontSize: '20px',
        color: '#1b1c1e',
    };

    const rowStyle = {
        marginBottom: '30px', 
    };


return (
    <div style={{ marginLeft: '100px' }}>
        <CoordinatorNavigation />
        <CoordinatorInfo />
            <h6 className="page-title"> SETTINGS </h6>
            <div className="container mt-4">
                <div className="row" style={rowStyle}>
                    <div className="col-md-12">
                        {[ 
                            { path: '/account-settings', icon: faUserCog, label: 'Account Settings' },
                            { path: '/manage-offenses', icon: faBuilding, label: 'Manage Offenses' },
                            { path: '/manage-sanctions', icon: faBook, label: 'Manage Sanctions' },
                            { path: '/manage-categories', icon: faCalendarAlt, label: 'Manage Categories' },
                            { path: '/manage-subcategories', icon: faTags, label: 'Manage Subcategories' },
                            { path: '/manage-violationnature', icon: faExclamationTriangle, label: 'Manage Nature of Violation' },
                        ].map(({ path, icon, label }, index) => (
                            <div
                                key={index}
                                style={containerStyle}
                                onClick={() => handleNavigation(path)}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                            >
                                <div style={iconContainerStyle}>
                                    <FontAwesomeIcon icon={icon} style={{ fontSize: '30px', color: '#1b1c1e' }} />
                                </div>
                                <h5 style={textStyle}>{label}</h5>
                                <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
