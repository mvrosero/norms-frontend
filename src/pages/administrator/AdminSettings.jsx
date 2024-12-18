import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faBuilding, faBook, faCalendarAlt, faChevronRight, faArchive } from '@fortawesome/free-solid-svg-icons';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";


export default function AdminSettings() {
    const navigate = useNavigate();
    const user_id = localStorage.getItem('user_id');

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
        marginRight: '20px', 
    };

    const textStyle = {
        fontSize: '20px',
        fontWeight: '500',
        color: '#1b1c1e',
        margin: 0,
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
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title"> SETTINGS </h6>
            <div className="container mt-4">
                <div className="row" style={rowStyle}>
                    <div className="col-md-12">
                        {[
                            { path: '/account-settings', icon: faUserCog, label: 'Account Settings' },
                            { path: '/manage-departments', icon: faBuilding, label: 'Manage Departments' },
                            { path: '/manage-programs', icon: faBook, label: 'Manage Programs' },
                            { path: '/manage-academicyears', icon: faCalendarAlt, label: 'Manage Academic Years' },
                            { path: '/manage-archives', icon: faArchive, label: 'Manage Archives' },
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
