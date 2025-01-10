import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HiOutlineMailOpen } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { IoGlobeOutline } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

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

  
    const containerStyle = {
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: '100vh',
        gap: '32px',
        paddingLeft: '130px'
    };

    const titleStyle = {
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '15px',
        color: '#0D4809'
    };

    const contentContainerStyle = {
        backgroundColor: "white",
        border: '1px solid #ddd',
        padding: '24px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '1100px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const bottomContainerStyle = {
        backgroundColor: "white",
        border: '1px solid #ddd',
        padding: '24px 0px 24px 80px',
        borderRadius: '8px',
        width: '500%',
        maxWidth: '1100px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const contentStyle = {
        fontSize: '16px',
        lineHeight: '1.75',
    };

    const primaryFunctionsContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '25px',
        width: '131%',
        fontWeight: '600'
    };

    const functionBoxStyle = {
        backgroundColor: "white",
        flex: '1', 
        border: '1px solid #ddd',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '15px'
    };

    
return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', marginTop: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '50px' }}>
                    About and Contact
                </h6>
            </div>

            {/* Primary Functions Section */}
            <div style={containerStyle}>
                <div>
                    <h6 style={titleStyle}>Primary Functions</h6>
                    <div style={primaryFunctionsContainerStyle}>
                        <div style={functionBoxStyle}>Student Well-being and Discipline</div>
                        <div style={functionBoxStyle}>Student Organizations</div>
                        <div style={functionBoxStyle}>Student Assistants’ Scholarship</div>
                    </div>
                </div>

                {/* Mission and Vision Section */}
                <div style={{ textAlign: 'justify' }}>
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
                <div style={{ marginBottom: '15px', textAlign: 'justify' }}>
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

                {/* Connect With Us Section */}
                <div style={{ marginBottom: '15px' }}>
                    <h6 style={titleStyle}>Connect With Us</h6>
                    <div style={bottomContainerStyle}>
                        <p style={contentStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <HiOutlineMailOpen style={{ color: '#0D4809', fontSize: '18px', marginRight: '8px' }} />
                                <strong style={{ width: '100px', marginLeft: '20px' }}>Email:</strong>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=osa@ncf.edu.ph" style={{ textDecoration: 'underline' }}>osa@ncf.edu.ph</a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <FiPhone style={{ color: '#0D4809', fontSize: '18px', marginRight: '8px' }} />
                                <strong style={{ width: '100px', marginLeft: '20px' }}>Phone:</strong>
                                <span>(054) 472-1234</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <FaFacebookF style={{ color: '#0D4809', fontSize: '18px', marginRight: '8px' }} />
                                <strong style={{ width: '100px', marginLeft: '20px' }}>Facebook:</strong>
                                <a href="https://www.facebook.com/osancf" target="_blank" rel="noopener noreferrer">
                                    NCF - Office for Student Affairs
                                </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <IoGlobeOutline style={{ color: '#0D4809', fontSize: '18px', marginRight: '8px' }} />
                                <strong style={{ width: '100px', marginLeft: '20px' }}>Website:</strong>
                                <a href="https://www.ncf.edu.ph" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                                    www.ncf.edu.ph
                                </a>
                            </div>
                        </p>
                    </div>
                </div>

                {/* Visit Us Section */}
                <div style={{ marginBottom: '30px' }}>
                    <h6 style={titleStyle}>Visit Us</h6>
                    <div style={bottomContainerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <GrLocation style={{ color: '#0D4809', fontSize: '18px', marginRight: '30px' }} />
                            <p style={{ margin: 0 }}>
                                ST 108, Ground Floor, Science and Technology Building, Naga College Foundation, Inc.
                            </p>
                        </div>
                        <div style={{ marginLeft: '50px', }}>
                            <p style={contentStyle}>
                                M.T. Villanueva Avenue, Naga City, Philippines, 4400
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
