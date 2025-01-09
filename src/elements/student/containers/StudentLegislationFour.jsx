import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationFour = () => {
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
                        Cybercrime Law <br></br> Republic Act No. 10175
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            The Cybercrime Prevention Act of 2012 (Republic Act No.
                            10175) is a law in the Philippines that aims to address various
                            forms of cybercrime such as hacking, online identity theft,
                            cybersex, and spamming. It provides for penalties for offenses
                            committed through the use of computer systems, networks,
                            and the Internet. The law defines cybercrime as any offenses
                            committed through the use of a computer system or any other
                            similar means, which includes the following acts:
                            <br />
                            <br />
                                <p style={{ marginLeft: '20px' }}>
                                    1.) Illegal access or hacking into computer systems and data;<br />
                                    2.) Identity theft or the unauthorized use of another person's identity;<br />
                                    3.) Distribution of child pornography;<br />
                                    4.) Cybersex or the use of the internet to engage in sexual acts for monetary gain;<br />
                                    5.) Spamming or the sending of unsolicited messages to individuals or groups;<br />
                                    6.) Computer-related fraud or the use of a computer to commit fraud;<br />
                                    7.) Online libel or the use of the internet to defame or slander another person.
                                </p>
                            <br />
                            The law also establishes the Cybercrime Investigation and
                            Coordination Center (CICC), which serves as the primary
                            agency tasked with enforcing the provisions of the law. It also
                            provides for the creation of a Cybercrime Court, which has
                            jurisdiction over cases involving cybercrime offenses
                            Penalties for cybercrime offenses under the law range from six
                            months to 20 years of imprisonment and/or fines ranging from
                            ₱100,000 to ₱10,000,000, depending on the severity of the
                            offenses.
                            <br />
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


export default StudentLegislationFour;
