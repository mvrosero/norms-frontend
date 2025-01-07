import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import SecurityInfo from '../security/SecurityInfo';
import UniformDefianceTable from '../../elements/security/tables/UniformDefianceTable';
import SearchAndFilter from '../general/SearchAndFilter';

export default function SecurityViewSlips() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '4') {
            navigate('/unauthorized');
        }
    }, [navigate]);


    const handleCreateSlip = () => {
        navigate('/create-slip'); 
    };


    return (
        <div>
            <SecurityInfo />
            <h6 className="page-title"> UNIFORM DEFIANCE </h6>

             {/* Search And Filter Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter setSearchQuery={setSearchQuery} />
                <button 
                    onClick={handleCreateSlip} 
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 30px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Create Slip
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Uniform Defiance Table */}
            <div>
                <UniformDefianceTable />
            </div>
        </div>
    );
}
