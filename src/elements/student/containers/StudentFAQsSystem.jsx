import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';
import iconColorImage from "../../../components/images/icon_colors.png";

const StudentFAQsSystem = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

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

    const toggleCollapsible = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


return (
    <div>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>System</h6>
            </div>

            {/* Breadcrumbs */}
            <nav style={{ marginTop: '30px', marginBottom: '30px', marginLeft: '120px' }}>
                <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex' }}>
                    <li className="breadcrumb-item" onClick={() => navigate('/student-faqs')} style={{ marginRight: '5px', color: '#0D4809' }}>
                        FAQs
                    </li>
                    <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                    <li style={{ marginLeft: '5px', color: '#000' }}>
                        System
                    </li>
                </ol>
            </nav>


            <style>
                {`
                    .collapsible {
                        background-color: #0D4809; 
                        color: white;
                        cursor: pointer;
                        padding: 18px;
                        width: 100%; 
                        max-width: 1100px; 
                        margin: 0 auto; 
                        border: none; 
                        text-align: left;
                        outline: none;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        transition: background-color 0.3s ease; 
                        height: 60px; 
                        border-radius: 8px 8px 0 0; 
                    }

                    .active, .collapsible:hover {
                        background-color: #005500; 
                    }

                    .content {
                        max-height: 0; 
                        max-width: 1100px; 
                        margin: 0 auto;
                        padding: 0 18px;
                        overflow: hidden;
                        background-color: #FFFFFF;
                        border: none; 
                        transition: max-height 0.3s ease, padding 0.3s ease;
                        width: 100%; 
                        box-sizing: border-box; 
                        margin-bottom: 0.5rem; 
                    }

                    .content.show {
                        max-height: 200px; 
                        padding: 18px;
                        margin-bottom: 1rem; 
                        border: 1px solid #0D4809; 
                        border-radius: 0 0 8px 8px;
                    }
                `}
            </style>


            {/* Collapsibles */}
            {['Question 1: What is NCF-OSA Records Management System?', 
                'Question 2: How can I access my profile?', 
                'Question 3: How do I change my password?', 
                'Question 4: Who can I contact for support?',
                'Question 5: Can I access the system from any device?',
                'Question 6: What is the purpose of the "Student My Records - Visual View" function?'].map((question, index) => (
                <div key={index} style={{ marginLeft: '80px' }}>
                    <button
                        type="button"
                        className={`collapsible ${openIndex === index ? 'active' : ''}`}
                        onClick={() => toggleCollapsible(index)}
                        style={{
                            borderRadius: openIndex === index ? '8px 8px 0 0' : '8px',  
                        }}
                    >
                        {question}
                        <span className="icon" style={{ fontSize: '24px', lineHeight: '60px' }}>
                            {openIndex === index ? '-' : '+'}
                        </span>
                    </button>
                    <div className={`content ${openIndex === index ? 'show' : ''}`} style={{ marginLeft: '38px' }}>
                        <p>
                            {index === 0 && "The NCF-OSA Records Management System is a digital platform designed to manage, store, and organize records for the NCF Office for Student Affairs (NCF-OSA). It helps streamline the record-keeping process, ensuring secure access, data integrity, and efficient handling of records."}
                            {index === 1 && "To access your profile, log in to the NORMS system using your credentials. After logging in, you can view and update your personal information by navigating to the 'Settings' option in the student info dropdown menu. Alternatively, you can click on the 'Settings' page in the navigation bar to directly access your account settings and profile."}
                            {index === 2 && "You can change your password by navigating to the 'Account Settings' section after logging in. There, you'll find an option to change your password. Follow the instructions, enter your current password, and set a new one to complete the process."}
                            {index === 3 && "For technical support or assistance with the system, you can contact the IT support team via email at support@ncf-osa.org. Our team is available to assist with any issues you may encounter."}
                            {index === 4 && "Yes, the NCF-OSA Records Management System (NORMS) is designed to be accessible from any device with an internet connection, including desktops, laptops, and smartphones. Simply visit the system's login page through your preferred browser to access your account."}
                            {index === 5 && (
                                <div style={{ marginBottom: '20px', height: 'auto' }}>
                                <p>
                                    It is a visual representation of violation records categorized by subcategories. With each offense represented by an icon and color-coded based on severity. A tooltip appears showing the offense name and count. Red icon color remains for beyond three offenses.
                                </p>
                                <img
                                    src={iconColorImage} 
                                    style={{ width: '45%', maxWidth: '600px', display: 'block', margin: '0 auto', objectFit: 'contain' }}
                                />
                                </div>
                            )}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default StudentFAQsSystem;
