import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforSettingsTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);


  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };


  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { status });
  };


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { status, [field]: value };

    // Update individual filter states
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
    setStatus('');
    onFilterChange({ status: '' });
  };


  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange} className="searchInput" style={{ color: '#333' }}/>
        <button onClick={toggleFilterDropdown} className={`filterButton ${isFilterActive ? 'active' : ''}`}>
            <IoFilter className={`filterIcon ${isFilterActive ? 'active' : ''}`} />
        </button>
        <button onClick={() => triggerSearch(searchQuery)} className="searchButton">
            <FaSearch className="searchIcon" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="filterDropdownWrapper">
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
