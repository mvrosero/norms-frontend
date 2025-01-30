import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiEqualizerLine } from "react-icons/ri";
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforDefianceHistory({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [nature, setNature] = useState('');
  const [filterDate, setFilterDate] = useState('');
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

  // Handle search input change (debounced)
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debounceTriggerSearch(query);
  };

  // Debounce search trigger to improve performance
  const debounceTriggerSearch = (() => {
    let timeout;
    return (query) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => triggerSearch(query), 300); // Delay of 300ms
    };
  })();

  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { nature, filterDate });
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = {
      nature: field === 'nature' ? value : nature,
      filterDate: field === 'filterDate' ? value : filterDate,
    };

    // Update state and trigger search
    if (field === 'nature') setNature(value);

    if (field === 'filterDate') setFilterDate(value);

    onFilterChange(updatedFilters);
    triggerSearch(searchQuery);
  };

  // Toggle filter dropdown visibility
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsFilterActive(!isFilterActive);
  };

  // Clear all filters and trigger search
  const clearFilters = () => {
    setNature('');
    setFilterDate('');
    onFilterChange({ nature: '', filterDate: '' });
    triggerSearch(searchQuery);
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
                <option key={nature.nature_id} value={nature.nature_name.toLowerCase()}>
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
