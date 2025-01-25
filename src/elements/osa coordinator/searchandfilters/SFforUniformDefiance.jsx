import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforUniformDefiance({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [nature, setNature] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
    onSearch(query, { nature });
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    if (field === 'nature') setNature(value);
    if (field === 'startDate') setStartDate(value);
    if (field === 'endDate') setEndDate(value);

    const updatedFilters = { nature, startDate, endDate, [field]: value };
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
    setStartDate('');
    setEndDate('');
    onFilterChange({ nature: '', startDate: '', endDate: '' });
  };

  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="searchInput"
          aria-label="Search input"
        />
        <button onClick={toggleFilterDropdown} className={`filterButton ${isFilterActive ? 'active' : ''}`} aria-label="Filter">
          <IoFilter className={`filterIcon ${isFilterActive ? 'active' : ''}`} />
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

          <div className="filterOption">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="filterSelect"
              aria-label="Start Date"
            />
          </div>

          <div className="filterOption">
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="filterSelect"
              aria-label="End Date"
            />
          </div>

          <button className="clearButton" onClick={clearFilters} aria-label="Clear Filters">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}





