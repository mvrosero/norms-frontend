import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentLegislations() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        }
    }, [navigate]);

    // Collapsible toggle function
    const toggleCollapsible = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Render null or a loading indicator until the redirection check is complete
    if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '3') {
        return null;
    }

    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title">LEGISLATIONS</h6>

            <style>
                {`
                    .collapsible {
                        background-color: #48794B; /* Updated green background */
                        color: white;
                        cursor: pointer;
                        padding: 18px;
                        width: 70%; /* Consistent width */
                        max-width: 600px;
                        margin: 0px auto;
                        border: none;
                        text-align: left;
                        outline: none;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        transition: background-color 0.3s ease; /* Smooth background color transition */
                    }

                    .active, .collapsible:hover {
                        background-color: #365b42; /* Slightly darker green on hover */
                    }

                    .content {
                        max-height: 0; /* Initially collapsed */
                        max-width: 600px;
                        margin: 0px auto;
                        padding: 0 18px;
                        overflow: hidden;
                        background-color: #f1f1f1;
                        transition: max-height 0.3s ease, padding 0.3s ease; /* Smooth height and padding transition */
                        width: 100%; /* Ensure consistent width */
                        box-sizing: border-box; /* Include padding in width calculation */
                    }

                    .content.show {
                        max-height: 100px; /* Adjust as needed */
                        max-width: 600px;
                        padding: 18px;
                    }

                    .icon {
                        font-size: 18px;
                    }
                `}
            </style>

            {['Section 1', 'Section 2', 'Section 3'].map((section, index) => (
                <div key={index}>
                    <button
                        type="button"
                        className={`collapsible ${openIndex === index ? 'active' : ''}`}
                        onClick={() => toggleCollapsible(index)}
                    >
                        {`Open ${section}`}
                        <span className="icon">
                            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                    </button>
                    <div className={`content ${openIndex === index ? 'show' : ''}`}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
