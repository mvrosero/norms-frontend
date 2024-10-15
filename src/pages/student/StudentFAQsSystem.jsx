import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';

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
        return null; // Redirect to unauthorized if not a valid user
    }

    const toggleCollapsible = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <h6 className="page-title">System</h6>
            <SearchAndFilter />
            <nav aria-label="breadcrumb" className="ms-5">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item" onClick={() => navigate('/student-faqs')} style={{ cursor: 'pointer' }}>
                        FAQs
                    </li>
                    <li className="breadcrumb-item">
                        System
                    </li>
                </ol>
            </nav>
            <StudentNavigation />
            <StudentInfo />

            <style>
                {`
                    .collapsible {
                        background-color: #006600; /* Updated background color */
                        color: white; /* Text color for contrast */
                        cursor: pointer;
                        padding: 18px;
                        width: 90%; /* Increased width for collapsible */
                        max-width: 1000px; /* Increased max width */
                        margin: 0 auto; /* Centering the button */
                        border: none;
                        text-align: left;
                        outline: none;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        transition: background-color 0.3s ease; /* Smooth background color transition */
                        height: 60px; /* Fixed height for the button */
                        border-radius: 8px; /* All corners rounded when collapsed */
                    }

                    .active, .collapsible:hover {
                        background-color: #005500; /* Darker green on hover */
                    }

                    .content {
                        max-height: 0; /* Initially collapsed */
                        max-width: 1000px; /* Adjusted max-width */
                        margin: 0 auto;
                        padding: 0 18px;
                        overflow: hidden;
                        background-color: #f1f1f1; /* Content background color */
                        transition: max-height 0.3s ease, padding 0.3s ease; /* Smooth height and padding transition */
                        width: 100%; /* Ensure consistent width */
                        box-sizing: border-box; /* Include padding in width calculation */
                        margin-bottom: 0.5rem; /* Reduced space after each container when collapsed */
                        border-top-left-radius: 0; /* Square top left when expanded */
                        border-top-right-radius: 0; /* Square top right when expanded */
                        border-bottom-left-radius: 8px; /* Rounded corners for bottom left when expanded */
                        border-bottom-right-radius: 8px; /* Rounded corners for bottom right when expanded */
                    }

                    .content.show {
                        max-height: 200px; /* Adjust as needed for expanded content */
                        padding: 18px;
                        margin-bottom: 1rem; /* Maintain space after each opened container */
                    }
                `}
            </style>

            {['Question 1: What is the system?', 
              'Question 2: How can I access my profile?', 
              'Question 3: Who can I contact for support?'].map((question, index) => (
                <div key={index}>
                    <button
                        type="button"
                        className={`collapsible ${openIndex === index ? 'active' : ''}`}
                        onClick={() => toggleCollapsible(index)}
                    >
                        {question}
                        <span className="icon" style={{ fontSize: '24px', lineHeight: '60px' }}>
                            {openIndex === index ? '-' : '+'}
                        </span>
                    </button>
                    <div className={`content ${openIndex === index ? 'show' : ''}`}>
                        <p>
                            {index === 0 && "This system is designed to provide students with easy access to frequently asked questions regarding various topics."}
                            {index === 1 && "You can access your profile by navigating to the 'Profile' section in the main menu."}
                            {index === 2 && "For support, you can contact the IT help desk via email or visit the support page on the website."}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StudentFAQsSystem;
