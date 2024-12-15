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
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">HISTORY</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter setSearchQuery={setSearchQuery} />
                <ExportDefianceHistoryCSV />
            </div>
            <UniformDefianceHistoryTable searchQuery={searchQuery} />
        </div>
    );
}
