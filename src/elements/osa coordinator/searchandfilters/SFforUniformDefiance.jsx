import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 
import '../../../styles/SearchAndFilter.css';

import { FaSearch } from 'react-icons/fa';
import { RiEqualizerLine } from "react-icons/ri";


export default function SFforUniformDefiance({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [nature, setNature] = useState('');
  const [changedAt, setChangedAt] = useState(null); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [natures, setNatures] = useState([]);

  // Fetch natures from the backend
  useEffect(() => {
    const fetchNatures = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/violation-natures');
        setNatures(response.data);
      } catch (error) {
        console.error('Error fetching natures:', error);
      }
    };
    fetchNatures();
  }, []);

  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };

  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { nature, changedAt });
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    if (field === 'nature') setNature(value);
    if (field === 'changedAt') setChangedAt(value);

    const updatedFilters = { nature, changedAt, [field]: value };
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
    setNature('');
    setChangedAt('');
    onFilterChange({ nature: '', changedAt: '' });
  };
  

  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input
          type="text"
          placeholder="Search nature of violation..."
          value={searchQuery}
          onChange={handleInputChange}
          className="searchInput"
          aria-label="Search input"
        />
        <button onClick={toggleFilterDropdown} className={`filterButton ${isFilterActive ? 'active' : ''}`} aria-label="Filter">
          <RiEqualizerLine className={`filterIcon ${isFilterActive ? 'active' : ''}`} />
        </button>
        <button onClick={() => triggerSearch(searchQuery)} className="searchButton" aria-label="Search">
          <FaSearch className="searchIcon" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="filterDropdownWrapper">
          <div className="filterOption">
            <select
              value={nature}
              onChange={(e) => handleFilterChange('nature', e.target.value)}
              className="filterSelect"
              aria-label="Nature of Violation"
            >
              <option value="">Nature of Violation</option>
              {natures.map((nature) => (
                <option key={nature.nature_id} value={nature.nature_name}>
                  {nature.nature_name}
                </option>
              ))}
            </select>
          </div>
          <button className="clearButton" onClick={clearFilters} aria-label="Clear Filters">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}





