import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import StudentRecordsTable from '../../elements/osa coordinator/tables/StudentRecordsTable';
import SFforStudentsTable from '../../elements/general/searchandfilters/SFforStudentsTable';
import CreateViolationModal from '../../elements/osa coordinator/modals/CreateViolationModal';

export default function CoordinatorStudentRecords() {
    const [showModal, setShowModal] = useState(false); 
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
      status: '',
      role: ''
    });
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '2') {
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
        
            if (filters.program) {
                    filtered = filtered.filter(user => user.program === filters.program);
                }
    
            if (filters.batch) {
                filtered = filtered.filter(user => user.batch === filters.batch);
            }
        
            if (filters.status) {
                filtered = filtered.filter(user => user.status === filters.status);
            }
    
            if (filters.role) {
                filtered = filtered.filter(user => user.role === filters.role);
            }
            setFilteredUsers(filtered);
        };
        useEffect(() => {
            fetchUsers();
        }, [fetchUsers]);






    const handleCreateNewRecord = () => {
        setShowModal(true); 
    };

    const handleCloseModal = () => {
        setShowModal(false); 
    };



       

return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />
            <h6 className="page-title"> STUDENT RECORDS </h6>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '100px', padding: '0 20px' }}>
                    <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SFforStudentsTable onSearch={handleSearch} onFilterChange={handleFilterChange}  /> </div>
                    <button onClick={handleCreateNewRecord} style={{ marginRight: '50px', backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                          Create Violation
                        <FaPlus style={{ marginLeft: '10px' }} />
                    </button>
                </div>

            {/* Table Section */}
            <StudentRecordsTable  
                filteredUsers={filteredUsers}  
                filters={filters}      
                searchQuery={searchQuery}                    
            />

            {/*Create Violation Modal*/}
            <CreateViolationModal
                show={showModal} 
                onHide={handleCloseModal} 
                handleCloseModal={handleCloseModal}
            />
        </div>
    );
}
