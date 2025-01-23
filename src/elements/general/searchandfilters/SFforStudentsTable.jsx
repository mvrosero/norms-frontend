import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiEqualizerLine } from "react-icons/ri";
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforStudentsTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [program, setProgram] = useState('');
  const [batch, setBatch] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  // Generate years for the batch
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, index) => currentYear - 5 + index);


  // Fetch programs from the backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/programs'); 
        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);


  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };


  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { yearLevel, program, batch, status });
  };


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { yearLevel, program, batch, status, [field]: value };

    // Update individual filter states
    if (field === 'yearLevel') setYearLevel(value);
    if (field === 'program') setProgram(value);
    if (field === 'batch') setBatch(value);
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
    setYearLevel('');
    setProgram('');
    setBatch('');
    setStatus('');
    onFilterChange({ yearLevel: '', program: '', batch: '', status: '' });
  };


  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange} className="searchInput"/>
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
              value={yearLevel}
              onChange={(e) => handleFilterChange('yearLevel', e.target.value)}
              className="filterSelect"
            >
              <option value="">Year Level</option>
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
              <option value="Fourth Year">Fourth Year</option>
              <option value="Fifth Year">Fifth Year</option>
            </select>
          </div>

          <div className="filterOption">
            <select
              value={program}
              onChange={(e) => handleFilterChange('program', e.target.value)}
              className="filterSelect"
            >
              <option value="">Program</option>
              {programs.map((program) => (
                <option key={program.program_id} value={program.program_name}>
                  {program.program_name}
                </option>
              ))}
            </select>
          </div>

          <div className="filterOption">
            <select
              value={batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
              className="filterSelect"
            >
              <option value="">Select Batch</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
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
