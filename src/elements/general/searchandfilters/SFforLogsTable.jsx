import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 
import '../../../styles/SearchAndFilter.css';

import { FaSearch } from 'react-icons/fa';
import { RiEqualizerLine } from "react-icons/ri";

export default function SFforLogsTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [changedAt, setChangedAt] = useState(null); 
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
    onSearch(query, { changedAt });
  };

  // Handle date filter change
  const handleFilterChange = (value) => {
    setChangedAt(value);
    onFilterChange({ changedAt: value });
    triggerSearch(searchQuery);
  };

  // Toggle filter dropdown visibility
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsFilterActive(!isFilterActive);
  };

  // Clear all filters
  const clearFilters = () => {
    setChangedAt(null); 
    onFilterChange({ changedAt: null });
  };


  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange} className="searchInput" style={{ color: '#333' }} />
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
                <DatePicker
                    selected={changedAt ? new Date(changedAt) : null}
                    onChange={(date) => {
                        if (date) {
                            // Adjust the date to local time and format as YYYY-MM-DD
                            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                .toISOString()
                                .split('T')[0];
                            handleFilterChange(localDate);
                        } else {
                            handleFilterChange(null); 
                        }
                    }}
                    placeholderText="Date"
                    dateFormat="yyyy/MM/dd"
                    type="date"
                    className="filterSelect"
                    aria-label="Date"
                />
            </div>
          <button className="clearButton" onClick={clearFilters}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
