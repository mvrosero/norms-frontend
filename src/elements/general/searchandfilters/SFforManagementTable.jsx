import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../../../styles/SearchAndFilter.css';

export default function SFfoManagementTable({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };

  // Trigger search with current query
  const triggerSearch = (query) => {
    onSearch(query);
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
          style={{ color: '#333' }}
        />
        <button onClick={() => triggerSearch(searchQuery)} className="searchButton">
          <FaSearch className="searchIcon" />
        </button>
      </div>
    </div>
  );
}
