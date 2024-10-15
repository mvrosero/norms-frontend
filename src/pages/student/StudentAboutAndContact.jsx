import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentAboutAndContact() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '3') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Inline styles
    const containerStyle = {
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: '100vh',
        gap: '32px',
        paddingLeft: '160px',
    };

    const titleStyle = {
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '8px',
    };

    const contentContainerStyle = {
        border: '1px solid #ddd',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '1000px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const contentStyle = {
        fontSize: '16px',
        lineHeight: '1.75',
    };

    const primaryFunctionsContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between', // Spread the items evenly
        gap: '16px',
        width: '110%',
    };

    const functionBoxStyle = {
        flex: '1', // Equal width for all containers
        border: '1px solid #ddd',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
                ABOUT AND CONTACT
            </h6>

            <div style={containerStyle}>
                {/* Primary Functions Section */}
                <div>
                    <h6 style={titleStyle}>Primary Functions</h6>
                    <div style={primaryFunctionsContainerStyle}>
                        <div style={functionBoxStyle}>Student Well-being and Discipline</div>
                        <div style={functionBoxStyle}>Student Organizations</div>
                        <div style={functionBoxStyle}>Student Assistants’ Scholarship</div>
                    </div>
                </div>

                <div>
                    <h6 style={titleStyle}>Mission</h6>
                    <div style={contentContainerStyle}>
                        <p style={contentStyle}>
                            The Office of Student Affairs (OSA) shall endeavor to promote, protect, and sustain the student’s physical, moral, and spiritual well-being,
                            and inculcate in them desirable values to harness leadership potential, intellectual discipline, civic efficiency, and social responsibility
                            towards nation-building. It shall set its direction and priorities on all development programs for Naga College Foundation students
                            to encourage active participation inspired by the core values of Quality, Excellence, Service, and Truth.
                        </p>
                    </div>
                </div>

                <div>
                    <h6 style={titleStyle}>Vision</h6>
                    <div style={contentContainerStyle}>
                        <p style={contentStyle}>
                            The Office for Student Affairs (OSA) shall be composed of dedicated and selfless women and men with values of honesty and integrity.
                            OSA commits itself to the protection, development, and active participation of the students towards empowerment, patriotism,
                            and improvement of their social and spiritual well-being, and moral responsibility. These shall be achieved through strong
                            partnerships between and among Academic and Non-Academic units of the school, serving with the highest degree of cooperation,
                            collaboration, and coordination. The office shall be an instrument and catalyst for the school’s positive change.
                        </p>
                    </div>
                </div>

                <div>
                    <h6 style={titleStyle}>Connect With Us</h6>
                    <div style={contentContainerStyle}>
                        <p style={contentStyle}>
                            Email: osa@ncf.edu.ph<br />
                            Phone: (054) 472-1234
                        </p>
                    </div>
                </div>

                <div>
                    <h6 style={titleStyle}>Visit Us</h6>
                    <div style={contentContainerStyle}>
                        <p style={contentStyle}>
                            Naga College Foundation<br />
                            Magsaysay Avenue, Naga City, Philippines
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
