import React from 'react';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from '../osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../osa coordinator/CoordinatorInfo';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';

export default function Handbook() {
    const navigate = useNavigate();
    const roleId = localStorage.getItem('role_id');
    const userId = localStorage.getItem('user_id'); 


    // Display navigation bar and account info based on user role
    const renderNavigation = () => {
        switch (roleId) {
            case '2': 
                return (
                    <>
                        <CoordinatorNavigation />
                        <CoordinatorInfo />
                    </>
                );
            case '3': 
                return (
                    <>
                        <StudentNavigation />
                        <StudentInfo />
                    </>
                );
            default:
                return null;
        }
    };

return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {renderNavigation()}

            {/* Title Section */}
            <div style={{ width: '90%', margin: '20px auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '50px' }}>
                    NCF Student Handbook
                </h6>
            </div>

            {/* PDF Viewer */}
            <div style={{ width: '95%', paddingBottom: '50px', paddingLeft: '80px' }}>
                <iframe
                    src="/files/NCF Student Handbook.pdf"
                    style={{ width: '100%', height: '600px', border: '1px solid #ccc', borderRadius: '5px' }}
                    title="PDF Viewer"
                ></iframe>
            </div>
        </div>
    );
}
