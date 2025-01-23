import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import styled from "@emotion/styled";
import { useNavigate } from 'react-router-dom';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";
import SFforLogsTable from '../../elements/general/searchandfilters/SFforLogsTable';
import UserLogsTable from '../../elements/administrator/tables/UserLogsTable';
import ExportUserLogsCSV from '../../elements/general/exports/ExportUserLogsCSV';

import activeImage from "../../../src/components/images/active.png";
import inactiveImage from "../../../src/components/images/inactive.png";
import archivedImage from "../../../src/components/images/archive.png";


// Styled Components
const BaseButton = styled.button`
  background-size: cover; border: none; display: flex; align-items: flex-start; justify-content: flex-start; border-radius: 10px; font-size: 30px; font-weight: 600; padding: 20px; width: 350px !important; height: 100px; color: white; cursor: pointer;
`;

const ActiveButton = styled(BaseButton)`
  background-image: url(${activeImage});
  color: #30a530;
  padding-left: 30px;
`;

const InactiveButton = styled(BaseButton)`
  background-image: url(${inactiveImage});
  color: #d9534f;
  padding-left: 30px;
`;

const ArchivedButton = styled(BaseButton)`
  background-image: url(${archivedImage});
  color: #6c757d;
  padding-left: 30px;
`;

export default function AdminUserLogs() {
    const navigate = useNavigate();
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allHistories, setAllHistories] = useState([]);  
    const [filteredHistories, setFilteredHistories] = useState([]);  
    const [filters, setFilters] = useState({
        changedAt: ''
    });
    const [userStatusCounts, setUserStatusCounts] = useState({ active: 0, inactive: 0, archived: 0 });


    // Fetch user counts by status
    useEffect(() => {
        const fetchUserStatusCounts = async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/user-status-counts');
            console.log('Backend response:', response.data); // Debugging the response
            setUserStatusCounts({
            active: response.data.active || 0,
            inactive: response.data.inactive || 0,
            archived: response.data.archived || 0
            });
        } catch (error) {
            console.error('Error fetching user status counts:', error);
        }
        };

        fetchUserStatusCounts();
    }, []);


      // Fetch histories
      const fetchHistories = useCallback(async () => {
        setLoading(true); 
        setError(false); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('https://test-backend-api-2.onrender.com/histories', { headers });
            setHistories(response.data);
            setAllHistories(response.data);
            setFilteredHistories(response.data);
        } catch (error) {
            console.error('Error fetching uniform histories:', error.response || error.message || error);
            setError(true); 
        } finally {
            setLoading(false); 
        }
    }, []);


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Handle filter changes (status)
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);
    };

  
    // Apply search query and filters to histories
    useEffect(() => {
        const filtered = allHistories.filter((user_history) => {
            const normalizedQuery = searchQuery.toLowerCase();

            // Generate action sentence for the current history entry
            const actionSentence = generateActionSentence(user_history).toLowerCase();

            // Check if the search query matches `updated_by`, `history_id`, or the generated action sentence
            const matchesQuery =
                user_history.updated_by.toLowerCase().includes(normalizedQuery) ||
                user_history.history_id.toLowerCase().includes(normalizedQuery) ||
                actionSentence.includes(normalizedQuery);  // Add this condition for action sentence

            // Standardize and compare `changed_at` dates
            const matchesDate = filters.changedAt
                ? new Date(user_history.changedAt).toISOString().split('T')[0] === new Date(filters.changedAt).toISOString().split('T')[0]
                : true;

            return matchesQuery && matchesDate;
        });

        setFilteredHistories(filtered);
    }, [searchQuery, filters, allHistories]);


      
    const handleActiveClick = () => navigate('/admin-usermanagement');
    const handleInactiveClick = () => navigate('/admin-usermanagement');
    const handleArchivedClick = () => navigate('/manage-archives');


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <AdminNavigation />
      <AdminInfo />
      

      {/* Title Section */}
      <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
        <h6 style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '30px' }}>
          User Logs
        </h6>
      </div>

      {/* Shortcut Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '20px', flexWrap: 'wrap' }}>
      <ActiveButton onClick={handleActiveClick} style={{ marginLeft: '80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Active</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '3px', color: '#5bb65b' }}>{userStatusCounts.active} Users</span>
            </div>
        </ActiveButton>
        <InactiveButton onClick={handleInactiveClick}> 
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Inactive</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '3px', color: '#db7d7a' }}>{userStatusCounts.inactive} Users</span>
            </div>
        </InactiveButton>
        <ArchivedButton onClick={handleArchivedClick}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Archived</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '3px', color: '#9d9e9f' }}>{userStatusCounts.archived} Users</span>
            </div>
        </ArchivedButton>
      </div>

      {/* Search and Filter Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '70px', padding: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 80%', minWidth: '300px' }}>
          <SFforLogsTable onSearch={handleSearch} onFilterChange={handleFilterChange}/>
        </div>
          <ExportUserLogsCSV/>
      </div>

        {/* Table Section */} 
        <UserLogsTable 
            filteredHistories={filteredHistories}  
            filters={filters}  
            searchQuery={searchQuery} 
        />
    </div>
  );
}