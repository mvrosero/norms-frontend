import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import StudentNavigation from './StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentSettings() {
    const navigate = useNavigate();
    const user_id = localStorage.getItem('user_id'); // Retrieve user_id from local storage

    const handleNavigation = (path) => {
        if (user_id) {
            navigate(`${path}/${user_id}`);
        } else {
            console.error('User ID not found');
        }
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
        position: 'relative', // Added relative positioning
    };

    const containerHoverStyle = {
        backgroundColor: '#e2e6ea',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    const iconStyle = {
        fontSize: '35px',
        marginLeft: '20px',
        marginRight: '30px',
    };

    const textStyle = {
        fontSize: '20px',
        fontWeight: '500',
        marginLeft: '10px',
        flex: 1, // Ensure text takes up space for arrow to be positioned correctly
    };

    const arrowStyle = {
        fontSize: '20px',
        color: '#1b1c1e',
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
    };

    return (
        <div style={{ marginLeft: '100px' }}>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title"> SETTINGS </h6>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/account-settings')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faUserCog} style={iconStyle} />
                            <h5 style={textStyle}>Account Settings</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
