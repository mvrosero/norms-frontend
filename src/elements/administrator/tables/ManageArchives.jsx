import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SFforArchivesTable from '../searchandfilters/SFforArchivesTable';
import ArchivesTable from './ArchivesTable';

export default function ManageArchives() {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);  
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const [filters, setFilters] = useState({
      yearLevel: '',
      department: '',
      program: '',
      batch: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);


    // Fetch users
    const fetchUsers = useCallback(async () => {
        setLoading(true); 
        setError(false); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('https://test-backend-api-2.onrender.com/users', { headers }
            );
            const activeUsers = response.data.filter(user => user.status !== 'archived');
            setUsers(activeUsers);
            setAllUsers(activeUsers);
            setFilteredUsers(activeUsers);
        } catch (error) {
            console.error('Error fetching users:', error.response || error.message || error);
            setError(true); 
        } finally {
            setLoading(false); 
        }
    }, []);


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
        const normalizedQuery = query ? query.toLowerCase() : '';
    
        const filtered = allUsers.filter(user => {
            const userName = user.name ? user.name.toLowerCase() : ''; 
            return userName.includes(normalizedQuery);
        });
        setFilteredUsers(filtered);  
    };


    // Handle filter changes (yearLevel, program, batch, status, and role)
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allUsers;
    
        // Apply filters one by one
        if (filters.yearLevel) {
            filtered = filtered.filter(user => user.yearLevel === filters.yearLevel);
        }

        if (filters.department) {
            filtered = filtered.filter(user => user.department === filters.department);
        }
    
        if (filters.program) {
                filtered = filtered.filter(user => user.program === filters.program);
            }

        if (filters.batch) {
            filtered = filtered.filter(user => user.batch === filters.batch);
        }
        setFilteredUsers(filtered);
    };
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


return (
    <div>
        <AdminNavigation />
        <AdminInfo />

            {/* Title Section */}
            <h6 className="page-title">ARCHIVED STUDENTS</h6>


            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '120px', width: '91%' }}>
                <div style={{ flex: '1 1 100%', width: '100%' }}>
                    <SFforArchivesTable onSearch={handleSearch} onFilterChange={handleFilterChange} />
                </div>
            </div>
            
            {/* Table Section */} 
            <ArchivesTable 
                filteredUsers={filteredUsers}  
                filters={filters}      
                searchQuery={searchQuery}   
            />
        </div>
    );
}
