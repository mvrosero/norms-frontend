import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { VscTable } from "react-icons/vsc";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import axios from 'axios';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SFforViolationsTable from '../../elements/general/searchandfilters/SFforViolationsTable';
import MyRecordsTable from '../../elements/student/tables/MyRecordsTable';
import MyRecordsHistoryTable from '../../elements/student/tables/MyRecordsHistoryTable';
import MyRecordsVisual from '../../elements/student/visuals/MyRecordsVisual';

export default function StudentMyRecords() {
    const [searchQuery, setSearchQuery] = useState('');
    const [allRecords, setAllRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filters, setFilters] = useState({
        category_name: '',
        academic_year: '',
        semester: '',
    });
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false); 
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('dashboard');

    const student_idnumber = localStorage.getItem('student_idnumber'); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        } else {
            fetchRecords(); 
        }
    }, [navigate]); 


    // Fetch violation records
    const fetchRecords = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`https://test-backend-api-2.onrender.com/myrecords/${student_idnumber}`, { headers });
            setAllRecords(response.data);
            setFilteredRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error.response || error.message || error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [student_idnumber]);


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
        const normalizedQuery = query ? query.toLowerCase() : '';
    
        const filtered = allRecords.filter(record => {
            const offense = record.offense_name ? record.offense_name.toLowerCase() : ''; 
            return offense.includes(normalizedQuery);
        });
        setFilteredRecords(filtered);  
    };

    // Handle filter changes
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allRecords;
    
        // Apply filters one by one
        if (filters.category_name) {
            filtered = filtered.filter(record => record.category_name === filters.category_name);
        }

        if (filters.academic_year) {
            filtered = filtered.filter(record => record.academic_year === filters.academic_year);
        }
        
        if (filters.semester_name) {
            filtered = filtered.filter(record => record.semester_name === filters.semester_name);
        }
    
        setFilteredRecords(filtered);
    };
    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    
return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '30px' }}> My Records </h6>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginLeft: '70px', padding: '0 20px' }}>
                 {/* Search And Filter Section */}
                <div style={{ flex: '1', minWidth: '400px' }}>
                    <SFforViolationsTable onSearch={handleSearch} onFilterChange={handleFilterChange} />
                </div>
                 {/* Icon Toggle Bar Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px' }}>
                    <MdOutlineDashboardCustomize size={50} style={{ cursor: 'pointer', color: activeView === 'dashboard' ? 'FAD32E' : 'C1C1C1' }} onClick={() => setActiveView('dashboard')} />
                    <VscTable size={52} style={{ cursor: 'pointer', color: activeView === 'table' ? 'FAD32E' : 'C1C1C1' }} onClick={() => setActiveView('table')} />
                    <HiOutlineSquare3Stack3D size={48} style={{ cursor: 'pointer', color: activeView === 'history' ? 'FAD32E' : 'C1C1C1' }} onClick={() => setActiveView('history')} />
                </div>
            </div>

            {/* Conditional Rendering of Views */}
            {activeView === 'table' ? (
            <MyRecordsTable 
                filteredRecords={filteredRecords}  
                filters={filters}  
                searchQuery={searchQuery} 
            />
            ) : activeView === 'dashboard' ? (
            <MyRecordsVisual />
            ) : activeView === 'history' ? (
            <MyRecordsHistoryTable 
                filteredRecords={filteredRecords}  
                filters={filters}  
                searchQuery={searchQuery} 
            />
            ) : null} 
        </div>
    );
};
