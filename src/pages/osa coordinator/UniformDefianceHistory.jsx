import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import UniformDefianceHistoryTable from '../../elements/osa coordinator/tables/UniformDefianceHistoryTable';
import ExportDefianceHistoryCSV from '../../elements/general/exports/ExportDefianceHistoryCSV';

export default function UniformDefianceHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);


return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />
            <h6 className="page-title">HISTORY</h6>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '70px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> 
                    <SearchAndFilter setSearchQuery={setSearchQuery} /> </div>
                    <ExportDefianceHistoryCSV /> </div>
                    <UniformDefianceHistoryTable searchQuery={searchQuery} />
            </div>
    );
}
