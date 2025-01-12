import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforProgramsTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:9000/departments'); 
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);


  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };


  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { department, status });
  };


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { department, status, [field]: value };

    // Update individual filter states
    if (field === 'department') setDepartment(value);
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
    setDepartment('');
    setStatus('');
    onFilterChange({ department: '', status: '' });
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
              value={department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="filterSelect"
            >
              <option value="">Department</option>
              {departments.map((department) => (
                <option key={department.department_id} value={department.department_name}>
                  {department.department_name}
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
