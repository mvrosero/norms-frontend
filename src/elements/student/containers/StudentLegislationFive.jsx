import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationFive = () => {
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
                        Anti-Sexual Harassment Law <br></br> Republic Act No. 7877
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            The Anti-Sexual Harassment Law of the Philippines, also
                            known as Republic Act No. 7877, is a law that aims to
                            protect individuals from sexual harassment in the
                            workplace, schools, and other similar environments.
                            <br />
                            <br />
                            Under the law, sexual harassment is defined as any
                            unwanted and unwelcome sexual advances, requests for
                            sexual favors, and other forms of verbal or physical
                            conduct of a sexual nature that have the effect of
                            creating a hostile, intimidating, or offensive
                            environment.
                            <br />
                            <br />
                            Employers, school administrators, and other persons in
                            authority are required to establish policies and
                            procedures for the prevention and resolution of sexual
                            harassment complaints. They are also required to
                            conduct information campaigns to educate employees
                            and students about their rights and responsibilities
                            under the law.
                            <br />
                            <br />
                            Victims of sexual harassment may file complaints with
                            the appropriate government agencies, such as the
                            Department of Labor and Employment, the Department
                            of Education, or the Commission on Human Rights. The
                            law also provides for penalties for violators, which may
                            include fines and imprisonment.
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


export default StudentLegislationFive;
