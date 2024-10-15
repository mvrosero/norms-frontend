import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaServer, FaQuestionCircle, FaServicestack, FaBook, FaShieldAlt, FaBan } from 'react-icons/fa'; // Importing icons
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';

const categoryData = [
    { name: 'System', icon: <FaServer />, path: '/student-faqs/system' },
    { name: 'General', icon: <FaQuestionCircle />, path: '/student-faqs/general' },
    { name: 'Services', icon: <FaServicestack />, path: '/student-faqs/services' },
    { name: 'Policies', icon: <FaBook />, path: '/student-faqs/policies' },
    { name: 'Data Privacy', icon: <FaShieldAlt />, path: '/student-faqs/data-privacy' },
    { name: 'Violations', icon: <FaBan />, path: '/student-faqs/violations' },
];

const StudentFAQs = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        }
    }, [navigate]);

    // Render null or a loading indicator until the redirection check is complete
    if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '3') {
        return null;
    }

    // Render the component if token and role_id are valid
    return (
        <div>
            <h6 className="page-title">Frequently Asked Questions</h6>
            <StudentNavigation />
            <StudentInfo />
            <div className="container mt-4">
                <div className="row justify-content-center"> {/* Centering the row */}
                    {categoryData.map((category, index) => (
                        <div 
                            key={index}
                            className="col-md-4 mb-3" 
                            onClick={() => navigate(category.path)} 
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                background: '#f8f9fa',
                                transition: 'background-color 0.3s',
                                height: '320px', 
                                width: '320px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '10px', 
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e6ea'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        >
                            <div style={{ fontSize: '80px', marginBottom: '20px' }}> {/* Increased icon size */}
                                {category.icon}
                            </div>
                            <h5 style={{ fontSize: '22px', marginTop: '5px' }}> {/* Increased text size and added margin */}
                                {category.name}
                            </h5>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentFAQs;
