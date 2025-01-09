import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationSeven = () => {
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
                        Campus Journalism Law <br></br> Republic Act No. 7079
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            The Campus Journalism Act or Republic Act No. 7079 is a
                            Philippine law that was enacted in 1991 to promote and
                            protect the freedom of speech and of the press among
                            campus journalists. The law encourages the development
                            of responsible campus journalism by providing student
                            journalists with opportunities for training and by
                            establishing guidelines for the publication and
                            distribution of campus publications.
                            <br />
                            <br />
                            Under the law, student publications are given the
                            freedom to express their opinions on matters of public
                            interest without prior restraint or censorship, as long as
                            they adhere to the principles of responsible journalism.
                            The law also mandates the creation of a school
                            publication adviser to provide guidance and support to
                            student journalists.
                            <br />
                            <br />
                            In addition, the law provides protection for campus
                            journalists against any form of harassment, intimidation,
                            or discrimination. Any person found guilty of violating
                            the provisions of the law may be subjected to penalties,
                            such as suspension or revocation of accreditation.
                            Overall, the Campus Journalism Act aims to promote the
                            values of free expression, responsible journalism, and
                            critical thinking among student journalists in the
                            Philippines.
                            <br />
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
                        { path: '/legislations/2', title: 'Anti-Hazing Law (Republic Act No. 11053)' },
                        { path: '/legislations/3', title: 'Safe Spaces Act (Republic Act No. 11313)' },
                        { path: '/legislations/4', title: 'Cybercrime Law (Republic Act No. 10175)' },
                        { path: '/legislations/5', title: 'Anti-Sexual Harassment Law (Republic Act No. 7877)' },
                        { path: '/legislations/6', title: 'Data Privacy Act (Republic Act No. 10173)' },
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


export default StudentLegislationSeven;
