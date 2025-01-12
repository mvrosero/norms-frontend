import React, { useState, useEffect, useCallback } from 'react';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforUniformDefiance from '../../elements/osa coordinator/searchandfilters/SFforUniformDefiance';
import UniformDefianceTable from '../../elements/osa coordinator/tables/UniformDefianceTable';

export default function CoordinatorUniformDefiance() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    const handleViewHistory = () => {
        navigate('/uniformdefiance-history'); 
    };


return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />
            <h6 className="page-title">UNIFORM DEFIANCE</h6>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '100px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SFforUniformDefiance setSearchQuery={setSearchQuery} /> </div>
                <button 
                    onClick={handleViewHistory} 
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 30px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginRight: '30px' }}>
                        View History
                    <FaEye style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <UniformDefianceTable searchQuery={searchQuery} />
        </div>
    );
}
