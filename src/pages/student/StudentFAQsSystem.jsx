import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentFAQsSystem = () => {
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

    console.log("Rendering FAQs System");

    return (
        <div>
            <h6 className="page-title">System</h6>
            <SearchAndFilter />
            <nav aria-label="breadcrumb" className="ms-5">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item" onClick={() => navigate('/student-faqs')} style={{ cursor: 'pointer' }}>
                        FAQs
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        System
                    </li>
                </ol>
            </nav>
            <StudentNavigation />
            <StudentInfo />

            <Accordion defaultActiveKey="0" className="mt-4">
                <Accordion.Item eventKey="0" style={{ marginBottom: '1rem' }}> {/* Add margin bottom here */}
                    <Accordion.Header>Question 1: What is the system?</Accordion.Header>
                    <Accordion.Body>
                        This system is designed to provide students with easy access to frequently asked questions regarding various topics.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" style={{ marginBottom: '1rem' }}> {/* Add margin bottom here */}
                    <Accordion.Header>Question 2: How can I access my profile?</Accordion.Header>
                    <Accordion.Body>
                        You can access your profile by navigating to the 'Profile' section in the main menu.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" style={{ marginBottom: '1rem' }}> {/* Add margin bottom here */}
                    <Accordion.Header>Question 3: Who can I contact for support?</Accordion.Header>
                    <Accordion.Body>
                        For support, you can contact the IT help desk via email or visit the support page on the website.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default StudentFAQsSystem;
