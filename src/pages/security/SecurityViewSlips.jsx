import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import SecurityInfo from '../security/SecurityInfo';
import UniformDefianceTable from '../../elements/security/tables/UniformDefianceTable';
import SFforDefianceTable from '../../elements/security/searchandfilters/SFforDefianceTable';
import '../../styles/General.css';

export default function SecurityViewSlips() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allRecords, setAllRecords] = useState([]);  
    const [filteredRecords, setFilteredRecords] = useState([]);  
    const [filters, setFilters] = useState({
      nature_name: '',
      status: '',
      filterDate: ''
    });
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


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
        const normalizedQuery = query ? query.trim().toLowerCase() : '';

        const filtered = allRecords.filter(record => {
            const nature_name = record.nature_name ? record.nature_name.trim().toLowerCase() : '';
            const studentId = record.student_idnumber ? record.student_idnumber.toString().toLowerCase() : '';

            // Check if either nature_name or studentId matches the search query
            return nature_name.includes(normalizedQuery) || studentId.includes(normalizedQuery);
        });

        setFilteredRecords(filtered);
    };


    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allRecords;
    
        // Apply 'nature_name' filter
        if (filters.nature_name) {
            filtered = filtered.filter(record => record.nature_name === filters.nature_name);
        }
    
        // Apply filter for the selected date (created_at comparison)
        if (filters.filterDate) {
            filtered = filtered.filter(record => {
                const defianceDate = new Date(record.created_at);
                const filterSelectedDate = new Date(filters.filterDate);
    
                // Compare only the date part (ignoring time part)
                return defianceDate.getFullYear() === filterSelectedDate.getFullYear() &&
                       defianceDate.getMonth() === filterSelectedDate.getMonth() &&
                       defianceDate.getDate() === filterSelectedDate.getDate();
            });
        }
        setFilteredRecords(filtered);
    };
    


    return (
        <div>
            <SecurityInfo />
            <h6 className="page-title"> UNIFORM DEFIANCE </h6>

             {/* Search And Filter Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SFforDefianceTable onSearch={handleSearch} onFilterChange={handleFilterChange} />
                <button 
                    onClick={handleCreateSlip} 
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 30px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Create Slip
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Uniform Defiance Table */}
            <div>
                <UniformDefianceTable 
                    filteredRecords={filteredRecords}  
                    filters={filters}  
                    searchQuery={searchQuery}  />
            </div>
        </div>
    );
}
