import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import SecurityInfo from '../security/SecurityInfo';
import UniformDefianceTable from './UniformDefianceTable';
import SearchAndFilter from '../general/SearchAndFilter';

export default function SecurityViewSlips() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '4') {
            navigate('/unauthorized');
        }
    }, [navigate]);


    return (
        <div>
            <SecurityInfo />
            <h6 className="page-title"> UNIFORM DEFIANCE </h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter setSearchQuery={setSearchQuery} />
            </div>
            <div>
                <UniformDefianceTable />
            </div>
        </div>
    );
}
