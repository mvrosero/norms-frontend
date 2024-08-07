import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faBuilding, faBook, faCalendarAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";

export default function AdminSettings() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const containerStyle = {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px', // Adjusted to px
        padding: '10px 20px',
        textAlign: 'left', // Align text to the left
        cursor: 'pointer',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        marginBottom: '10px',
        height: '80px',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center', // Center the icon and text vertically
        position: 'relative', // For positioning the arrow inside
        paddingRight: '40px' // Space for the arrow
    };

    const containerHoverStyle = {
        backgroundColor: '#e2e6ea',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    const iconStyle = {
        fontSize: '35px', // Adjusted to px
        marginLeft: '20px',
        marginRight: '30px' // Space between icon and text
    };

    const textStyle = {
        fontSize: '20px', // Adjusted to px
        fontWeight: '500',
        marginLeft: '10px',
    };

    const arrowStyle = {
        fontSize: '20px',
        color: '#1b1c1e',
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)', // Center the arrow vertically
    };

    return (
        <div style={{ marginLeft: '100px' }}> {/* Adjust margin-left to account for the navigation bar */}
            <AdminNavigation />
            <AdminInfo />
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
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/manage-departments')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faBuilding} style={iconStyle} />
                            <h5 style={textStyle}>Manage Departments</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/manage-programs')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faBook} style={iconStyle} />
                            <h5 style={textStyle}>Manage Programs</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/manage-academicyears')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} style={iconStyle} />
                            <h5 style={textStyle}>Manage Academic Years</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

