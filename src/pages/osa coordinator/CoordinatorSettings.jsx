import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faBuilding, faBook, faCalendarAlt, faChevronRight, faTags, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';

export default function CoordinatorSettings() {
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
        position: 'relative',
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
        flex: 1,
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
            <CoordinatorNavigation />
            <CoordinatorInfo />
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
                            onClick={() => handleNavigation('/manage-offenses')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faBuilding} style={iconStyle} />
                            <h5 style={textStyle}>Manage Offenses</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/manage-sanctions')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faBook} style={iconStyle} />
                            <h5 style={textStyle}>Manage Sanctions</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/manage-categories')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} style={iconStyle} />
                            <h5 style={textStyle}>Manage Categories</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                        {/* New Options with Updated Icons */}
                        <div
                            style={containerStyle}
                            onClick={() => handleNavigation('/manage-subcategories')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faTags} style={iconStyle} /> {/* Updated Icon */}
                            <h5 style={textStyle}>Manage Subcategories</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                        <div
                            style={{ ...containerStyle, marginBottom: '50px' }}
                            onClick={() => handleNavigation('/manage-violationnature')}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, containerHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyle)}
                        >
                            <FontAwesomeIcon icon={faExclamationTriangle} style={iconStyle} /> {/* Updated Icon */}
                            <h5 style={textStyle}>Manage Nature of Violation</h5>
                            <FontAwesomeIcon icon={faChevronRight} style={arrowStyle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
