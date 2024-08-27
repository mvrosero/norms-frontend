import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentAboutAndContact() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '3') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Inline styles
    const containerStyle = {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center horizontally
        minHeight: '100vh', // Ensure the container takes at least full viewport height
        gap: '1rem',
    };

    const rowStyle = {
        border: '1px solid #ddd',
        padding: '1rem',
        borderRadius: '4px',
        width: '80%', // Adjust width as needed
        maxWidth: '600px', // Ensure containers don't get too wide
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional: add shadow for better visual separation
    };

    const titleStyle = {
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    };

    const contentStyle = {
        fontSize: '0.9rem',
    };

    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>ABOUT AND CONTACT</h6>
            <div style={containerStyle}>
                <div style={rowStyle}>
                    <h6 style={titleStyle}>MISSION</h6>
                    <p style={contentStyle}>The Office of Student Affairs (OSA) shall endeavor to promote, protect, and sustain the student’s physical, moral, spiritual well-being, and inculcate in them desirable values to harness leadership potential, intellectual discipline, civic efficiency, and social responsibility towards nation building. It shall set its direction and priorities on all development programs for Naga College Foundation students to encourage active participation inspired by the core values of Quality, Excellence, Service, and Truth.</p>
                </div>
                <div style={rowStyle}>
                    <h6 style={titleStyle}>VISION</h6>
                    <p style={contentStyle}>The Office for Student Affairs (OSA) shall be composed of dedicated and selfless women and men with values of honesty and integrity. OSA commits itself to the protection,  development and active participation of the students towards empowerment, patriotism, improvement, of their social and spiritual well-being, and moral responsibility. These shall be achieved through strong partnership between and among Academic and Non-Academic units of the school, serving with highest degree of cooperation, collaboration, and coordination. The office shall be an instrument and catalyst for the school’s positive change.</p>
                </div>
                <div style={rowStyle}>
                    <h6 style={titleStyle}>PRIMARY FUNCTIONS</h6>
                    <p style={contentStyle}>
                        <p> Student Well-being and Discipline </p>
                        <p> Student Organizations </p>
                        <p> Student Assistants’ Scholarship </p>
                    </p>
                </div>
            </div>
        </div>
    );
}
