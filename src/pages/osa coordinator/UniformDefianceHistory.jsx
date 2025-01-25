import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforDefianceHistory from '../../elements/osa coordinator/searchandfilters/SFforDefianceHistory';
import UniformDefianceHistoryTable from '../../elements/osa coordinator/tables/UniformDefianceHistoryTable';
import ExportDefianceHistoryCSV from '../../elements/general/exports/ExportDefianceHistoryCSV';

export default function UniformDefianceHistory() {
    const [defiances, setDefiances] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allDefiances, setAllDefiances] = useState([]);  
    const [filteredDefiances, setFilteredDefiances] = useState([]);  
    const [filters, setFilters] = useState({
      nature_name: '',
      status: '',
      filterDate: ''
    });
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);


    // Fetch uniform defiances
    const fetchDefiances = useCallback(async () => {
        setLoading(true); 
        setError(false); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('https://test-backend-api-2.onrender.com/uniform_defiances', { headers });
            setDefiances(response.data);
            setAllDefiances(response.data);
            setFilteredDefiances(response.data);
        } catch (error) {
            console.error('Error fetching uniform defiances:', error.response || error.message || error);
            setError(true); 
        } finally {
            setLoading(false); 
        }
    }, []);
    

        // Handle search query changes
        const handleSearch = (query) => {
            setSearchQuery(query);
            const normalizedQuery = query ? query.trim().toLowerCase() : '';

            const filtered = allDefiances.filter(defiance => {
                const nature_name = defiance.nature_name ? defiance.nature_name.trim().toLowerCase() : '';
                const studentId = defiance.student_idnumber ? defiance.student_idnumber.toString().toLowerCase() : '';

                // Check if either nature_name or studentId matches the search query
                return nature_name.includes(normalizedQuery) || studentId.includes(normalizedQuery);
            });

            setFilteredDefiances(filtered);
        };



    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allDefiances;
    
        // Apply 'nature_name' filter
        if (filters.nature_name) {
            filtered = filtered.filter(defiance => defiance.nature_name === filters.nature_name);
        }
    
        // Apply filter for the selected date (created_at comparison)
        if (filters.filterDate) {
            filtered = filtered.filter(defiance => {
                const defianceDate = new Date(defiance.created_at);
                const filterSelectedDate = new Date(filters.filterDate);
    
                // Compare only the date part (ignoring time part)
                return defianceDate.getFullYear() === filterSelectedDate.getFullYear() &&
                       defianceDate.getMonth() === filterSelectedDate.getMonth() &&
                       defianceDate.getDate() === filterSelectedDate.getDate();
            });
        }
        setFilteredDefiances(filtered);
    };
    


return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />
            <h6 className="page-title">HISTORY</h6>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '100px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 80%', minWidth: '300px' }}>  
                    <SFforDefianceHistory onSearch={handleSearch} onFilterChange={handleFilterChange}/> </div>
                    <ExportDefianceHistoryCSV filteredDefiances={filteredDefiances}/> </div>
                    <UniformDefianceHistoryTable   
                        filteredDefiances={filteredDefiances}  
                        filters={filters}  
                        searchQuery={searchQuery}               
                    />
            </div>
    );
}
