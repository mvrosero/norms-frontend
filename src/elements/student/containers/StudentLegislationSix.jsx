import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationSix = () => {
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
                        Data Privacy Act <br></br> Republic Act No. 10173
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            The Philippines' Data Privacy Act of 2012 (DPA) is the
                            primary law governing the collection, processing, and
                            storage of personal data in the country. The DPA aims to
                            protect the privacy rights of individuals while ensuring the
                            free flow of information for innovation, growth, and
                            national development.
                            <br />
                            <br />
                            Under the DPA, personal data refers to any information that
                            can be used to identify a natural person, such as name,
                            address, date of birth, and contact details, among others. It
                            covers data collected, processed, or stored by both public
                            and private entities operating in the Philippines.
                            <br />
                            <br />
                            The DPA requires entities to obtain consent from
                            individuals before collecting their personal data and to use
                            the data only for specified and legitimate purposes. The law
                            also mandates entities to implement measures to protect
                            the confidentiality, integrity, and availability of person
                            data, and to report any data breaches to the National
                            Privacy Commission (NPC) within 72 hours.
                            <br />
                            <br />
                            The NPC, created under the DPA, is responsible for
                            enforcing the law and ensuring compliance with its
                            provisions. It has the power to investigate violations,
                            impose sanctions and penalties, and provide guidance to
                            entities on complying with the law.
                            Overall, the DPA seeks to promote a culture of privacy in the
                            Philippines by safeguarding the rights of individuals to
                            their personal data while enabling organizations to use such
                            data responsibly and ethically for their business operations.
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


export default StudentLegislationSix;
