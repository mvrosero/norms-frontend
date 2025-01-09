import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import MyRecordsTable from '../../elements/student/tables/MyRecordsTable';

const StudentMyRecords = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '30px' }}>
                    My Records
                </h6>
            </div>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 100%', minWidth: '300px' }}> <SearchAndFilter /> </div>
            </div>

            <MyRecordsTable />
        </div>
    );
};


export default StudentMyRecords;
