import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationEight = () => {
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
                        Comprehensive Dangerous Drug Act <br></br> Republic Act No. 9165
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            The Comprehensive Dangerous Drugs Act of 2002 (Republic
                            Act No. 9165) is a law in the Philippines that aims to address
                            the country's drug problem by regulating and penalizing
                            drug-related activities. The law defines dangerous drugs
                            and lists prohibited acts related to the manufacture,
                            distribution, and use of illegal drugs.
                            <br />
                            <br />
                            Under the law, the government is mandated to create a
                            comprehensive drug prevention and control program, as
                            well as to establish drug treatment and rehabilitation
                            centers for drug users. The law also establishes a
                            comprehensive system of penalties for drug offenses, which
                            includes imprisonment, fines, and mandatory drug testing.
                            <br />
                            <br />
                            The Comprehensive Dangerous Drugs Act of 2002 also
                            created the Dangerous Drugs Board (DDB), which is
                            responsible for formulating policies, plans, and programs
                            on drug prevention and control. The law also established
                            the Philippine Drug Enforcement Agency (PDEA), which is
                            responsible for implementing the government's drug
                            prevention and control programs and enforcing the law.
                            <br />
                            <br />
                            The law has undergone several amendments since its
                            enactment, including the passage of the Philippine
                            Compassionate Medical Cannabis Act in 2019, which allows
                            the use of medical marijuana in the Philippines under
                            certain conditions. However, the Comprehensive Dangerous
                            Drugs Act of 2002 remains a critical legal framework for
                            addressing the country's drug problem.
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
                        { path: '/legislations/7', title: 'Campus Journalism Law (Republic Act No. 7079)' }
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


export default StudentLegislationEight;
