import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationTwo = () => {
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
    <div style={{ display: 'flex', position: 'relative', padding: '20px' }}>
        <div style={{ flex: '1' }}>
            <StudentNavigation />
            <StudentInfo />

                {/* Title Section */}
                <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                    <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>
                        Anti-Hazing Law <br></br> Republic Act No. 11053
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            The Anti-Hazing Law of the Philippines, also known as Republic Act No. 8049, was enacted in 1995 to address the issue of hazing in fraternities, sororities, and other organizations in the country. The law defines hazing as an initiation rite or practice that involves the infliction of physical or psychological harm to a neophyte or applicant as a prerequisite for admission or membership into an organization.
                            <br />
                            <br />
                            Under the law, hazing is considered a criminal offense and is punishable by imprisonment, fines, and other penalties. It is also prohibited to participate in or conceal any hazing activity, as well as to force someone to undergo hazing. Any person found guilty of violating the Anti-Hazing Law can face penalties including imprisonment for up to 20 years, fines of up to PHP 3 million, and expulsion from school or university.
                            <br />
                            <br />
                            Furthermore, educational institutions are required to take measures to prevent hazing activities, such as implementing anti-hazing policies and educating students about the dangers of hazing. The law also mandates that schools and universities should report any hazing incident to the authorities within 24 hours.
                            <br />
                            <br />
                            Overall, the Anti-Hazing Law aims to protect the safety and well-being of students and prevent the culture of violence and abuse in organizations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Vertical Rectangle Container */}
            <div style={{ width: '250px', backgroundColor: '#f7f7f7', border: '1px solid #ddd', marginTop: '65px', marginRight: '10px', borderRadius: '8px' }}>
                <div style={{ backgroundColor: '#FAD32E', color: 'white', textAlign: 'center', borderRadius: '5px 5px 0 0' }}>
                    <h2 style={{ margin: '0', fontSize: '15px', fontWeight: '800', lineHeight: '40px' }}>
                        Other Legislations
                    </h2>
                </div>
                <ul style={{ listStyleType: 'circle', padding: '20px 30px 20px 50px' }}>
                    {[
                        { path: '/legislations/1', title: '1987 Constitution' },
                        { path: '/legislations/3', title: 'Safe Spaces Act (Republic Act No. 11313)' },
                        { path: '/legislations/4', title: 'Cybercrime Law (Republic Act No. 10175)' },
                        { path: '/legislations/5', title: 'Anti-Sexual Harassment Law (Republic Act No. 7877)' },
                        { path: '/legislations/6', title: 'Data Privacy Act (Republic Act No. 10173)' },
                        { path: '/legislations/7', title: 'Campus Journalism Law (Republic Act No. 7079)' },
                        { path: '/legislations/8', title: 'Comprehensive Dangerous Drug Act of 2002 (Republic Act No. 9165)' },
                        ].map(({ path, title }, index) => (
                            <li key={index} style={{ marginBottom: '15px' }}>
                                <Link
                                    to={path}
                                    style={{
                                        marginLeft: '5px',
                                        fontSize: '14px',
                                        textDecoration: 'underline',
                                        color: '#737373',
                                    }}
                                >
                                    {title}
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};


export default StudentLegislationTwo;
