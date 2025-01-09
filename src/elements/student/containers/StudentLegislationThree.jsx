import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';

const StudentLegislationThree = () => {
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
                        Safe Spaces Act <br></br> Republic Act No. 11313
                    </h6>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'flex-start' }}>
                    <div style={{ width: '800px', padding: '30px', marginTop: '20px', marginLeft: '100px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontSize: '16px', color: 'black', textAlign: 'justify', margin: 0 }}>
                            Republic Act No. 11313, also known as the Safe Spaces Act,
                            is a law in the Philippines that seeks to prevent and address
                            gender-based sexual harassment in public spaces, both
                            online and offline. The law defines gender-based sexual
                            harassment as any act that "affects the psychological
                            emotional, and physical well-being" of an individual and
                            includes physical, verbal, or non-verbal behavior that is
                            sexual in nature and unwanted.
                            <br />
                            <br />
                            The Safe Spaces Act mandates the creation of Safe Spaces in
                            public areas, such as schools, workplaces, streets, and
                            transportation terminals, to prevent gender-based sexual
                            harassment. It also requires the establishment of a Safe
                            Spaces Program in schools and universities to provide
                            education and training on the prevention and response to
                            sexual harassment.
                            <br />
                            <br />
                            The law also imposes penalties for those who violate the
                            provisions of the Safe Spaces Act. Depending on the nature
                            and severity of the offense, violators may face fines
                            imprisonment, or both. Additionally, the law requires
                            government agencies and instrumentalities to implement
                            measures to prevent and address gender-based sexual
                            harassment in their respective workplaces.
                            <br />
                            <br />
                            The Safe Spaces Act aims to promote gender equality and
                            the protection of women and other marginalized groups
                            from gender-based sexual harassment. It underscores the
                            government's commitment to ensuring the safety and
                            security of all individuals, particularly those who are
                            vulnerable to sexual harassment in public spaces.
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


export default StudentLegislationThree;
