import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiEqualizerLine } from "react-icons/ri";
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforEmployeesTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [roles, setRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/roles'); 
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);


  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };


  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { role, status });
  };


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { role, status, [field]: value };

    // Update individual filter states
    if (field === 'role') setRole(value);
    if (field === 'status') setStatus(value);

    onFilterChange(updatedFilters); 
    triggerSearch(searchQuery); 
  };


  // Toggle filter dropdown visibility
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsFilterActive(!isFilterActive);
  };


  // Clear all filters
  const clearFilters = () => {
    setRole('');
    setStatus('');
    onFilterChange({ role: '', status: '' });
  };


  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input type="text" placeholder="Search name..." value={searchQuery} onChange={handleInputChange} className="searchInput"/>
        <button onClick={toggleFilterDropdown} className={`filterButton ${isFilterActive ? 'active' : ''}`}>
            <RiEqualizerLine className={`filterIcon ${isFilterActive ? 'active' : ''}`} />
        </button>
        <button onClick={() => triggerSearch(searchQuery)} className="searchButton">
            <FaSearch className="searchIcon" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="filterDropdownWrapper">
         <div className="filterOption">
            <select
                value={role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="filterSelect"
            >
                <option value="">Role</option>
                {roles
                .filter((role) => role.role_id !== 3) 
                .map((role) => (
                    <option key={role.role_id} value={role.role_name}>
                    {role.role_name}
                    </option>
                ))}
            </select>
          </div>

          <div className="filterOption">
            <select
              value={status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filterSelect"
            >
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button className="clearButton" onClick={clearFilters}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
