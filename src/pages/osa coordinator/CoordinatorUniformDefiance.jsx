import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforUniformDefiance from '../../elements/osa coordinator/searchandfilters/SFforUniformDefiance';
import UniformDefianceTable from '../../elements/osa coordinator/tables/UniformDefianceTable';

export default function CoordinatorUniformDefiance() {
    const [defiances, setDefiances] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allDefiances, setAllDefiances] = useState([]);  
    const [filteredDefiances, setFilteredDefiances] = useState([]);  
    const [filters, setFilters] = useState({
      nature_name: '',
      startDate: '',
      endDate: ''
    });
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


    // Fetch uniform defiances
    const fetchDefiances = useCallback(async () => {
        setLoading(true); 
        setError(false); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
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
            return nature_name.includes(normalizedQuery);
        });

        setFilteredDefiances(filtered);
    };

    
    // Handle filter changes 
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  

        let filtered = allDefiances;

        // Apply filters one by one
        if (filters.nature_name) {
            filtered = filtered.filter(defiance => defiance.nature_name === filters.nature_name);
        }

        // Start date filter
        if (filters.startDate) {
            filtered = filtered.filter(defiance => {
                const defianceDate = new Date(defiance.created_at);
                const filterStartDate = new Date(filters.startDate);
                return defianceDate >= filterStartDate;
            });
        }

        // End date filter
        if (filters.endDate) {
            filtered = filtered.filter(defiance => {
                const defianceDate = new Date(defiance.created_at);
                const filterEndDate = new Date(filters.endDate);
                return defianceDate <= filterEndDate;
            });
        }
        setFilteredDefiances(filtered);
    };
    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

    
    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">UNIFORM DEFIANCE</h6>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '100px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> 
                    <SFforUniformDefiance onSearch={handleSearch} onFilterChange={handleFilterChange} /> 
                </div>
                <button 
                    onClick={handleViewHistory} 
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 30px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginRight: '30px' }}>
                    View History
                    <FaEye style={{ marginLeft: '10px' }} />
                </button>
            </div>

            <UniformDefianceTable                     
                filteredDefiances={filteredDefiances}  
                filters={filters}  
                searchQuery={searchQuery} 
            />
        </div>
    );
}
