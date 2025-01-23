import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";
import SFforStudentsTable from '../../elements/general/searchandfilters/SFforStudentsTable';
import SFforEmployeesTable from '../../elements/administrator/searchandfilters/SFforEmployeesTable';
import StudentsTable from '../../elements/administrator/tables/StudentsTable';
import EmployeesTable from '../../elements/administrator/tables/EmployeesTable';
import ImportStudentsCSV from '../../elements/general/imports/ImportStudentsCSV'; 
import ImportEmployeesCSV from '../../elements/general/imports/ImportEmployeesCSV'; 
import UserDropdownButton from '../../elements/general/buttons/UserDropdownButton';

export default function AdminUserManagement() {
    const [selectedComponent, setSelectedComponent] = useState('students');
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


    const handleComponentChange = (event) => {
        const newComponent = event.target.value;
    
        // Reset filters and search query when switching components
        setFilters({
            yearLevel: '',
            department: '',
            program: '',
            batch: '',
            status: '',
            role: ''
        });
        setSearchQuery('');
    
        // Reset filteredUsers based on the selected component
        if (newComponent === 'students') {
            const filtered = allUsers.filter(user => user.role === 'student');
            setFilteredUsers(filtered);
        } else if (newComponent === 'employees') {
            const filtered = allUsers.filter(user => user.role === 'employee');
            setFilteredUsers(filtered);
        }
    
        setSelectedComponent(newComponent);
    };
    

return (
    <div>
        <AdminNavigation />
        <AdminInfo />

            {/* Title Section */}
            <h6 className="page-title"> USER MANAGEMENT </h6>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '70px', padding: '0 20px', gap: '2px' }}>
                <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
                    {selectedComponent === 'students' && <SFforStudentsTable onSearch={handleSearch} onFilterChange={handleFilterChange} searchQuery={searchQuery}/>}
                    {selectedComponent === 'employees' && <SFforEmployeesTable onSearch={handleSearch} onFilterChange={handleFilterChange} searchQuery={searchQuery}/>}
                </div>
                <UserDropdownButton/>
                {selectedComponent === 'students' && <ImportStudentsCSV />}
                {selectedComponent === 'employees' && <ImportEmployeesCSV />}
            </div>

            {/* Radio buttons for selecting user type */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                    <input
                        type="radio"
                        id="students"
                        name="userType"
                        value="students"
                        checked={selectedComponent === 'students'}
                        onChange={handleComponentChange}
                        style={{
                            marginRight: '5px',
                            backgroundColor: selectedComponent === 'students' ? 'gray' : 'white',
                            border: '1px solid gray',
                            cursor: 'pointer',
                        }}
                    />
                    <label htmlFor="students" style={{ color: 'gray', cursor: 'pointer' }}>Students</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="radio"
                        id="employees"
                        name="userType"
                        value="employees"
                        checked={selectedComponent === 'employees'}
                        onChange={handleComponentChange}
                        style={{
                            marginRight: '5px',
                            backgroundColor: selectedComponent === 'employees' ? 'gray' : 'white',
                            border: '1px solid gray',
                            cursor: 'pointer',
                        }}
                    />
                    <label htmlFor="employees" style={{ color: 'gray', cursor: 'pointer' }}>Employees</label>
                </div>
            </div>

            {/* Display the tables based on selected radio button */}
            {selectedComponent === 'students' && (
                <StudentsTable 
                    filteredUsers={filteredUsers}  
                    filters={filters}      
                    searchQuery={searchQuery} 
                />
            )}
            {selectedComponent === 'employees' && (
                <EmployeesTable 
                    filteredUsers={filteredUsers}  
                    filters={filters}  
                    searchQuery={searchQuery}  
                />
            )}
        </div>
    );
}
