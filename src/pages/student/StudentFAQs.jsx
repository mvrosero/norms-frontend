import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaExclamationTriangle, FaServer, FaQuestionCircle, FaBook, FaShieldAlt } from 'react-icons/fa'; 
import { RiServiceFill } from "react-icons/ri";

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';


const categoryData = [
    { name: 'System', icon: <FaServer />, path: '/student-faqs/system' },
    { name: 'General', icon: <FaQuestionCircle />, path: '/student-faqs/general' },
    { name: 'Services', icon: <RiServiceFill />, path: '/student-faqs/services' },
    { name: 'Policies', icon: <FaBook />, path: '/student-faqs/policies' },
    { name: 'Data Privacy', icon: <FaShieldAlt />, path: '/student-faqs/data-privacy' },
    { name: 'Violations', icon: <FaExclamationTriangle />, path: '/student-faqs/violations' },
];

const StudentFAQs = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        }
    }, [navigate]);
    if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '3') {
        return null;
    }


return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', marginTop: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '50px' }}>
                    Frequently Asked Questions
                </h6>
            </div>

            {/* FAQs Container Section */}
            <div className="faqs-container" style={{ marginBottom: '50px', marginLeft: '80px' }}>
                <div className="row justify-content-center"> 
                    {categoryData.map((category, index) => (
                        <div key={index} className="col-md-4 mb-3" onClick={() => navigate(category.path)} 
                             style={{ cursor: 'pointer', textAlign: 'center', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', background: '#FFFFFF', transition: 'background-color 0.3s', height: '300px', width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e6ea'}
                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            >
                            <div style={{ color: '#0D4809', fontSize: '80px', marginBottom: '20px' }}> 
                                {category.icon}
                            </div>
                            <h5 style={{ color: '#0D4809', fontSize: '22px', fontWeight: '500', marginTop: '5px' }}> 
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
