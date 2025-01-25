import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforOffensesTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [offenses, setOffenses] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);


    // Fetch offenses from the backend
    useEffect(() => {
        const fetchOffenses = async () => {
          try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/offenses'); 
            setOffenses(response.data);
          } catch (error) {
            console.error('Error fetching offenses:', error);
          }
        };
        fetchOffenses();
      }, []);


    // Fetch offenses from the backend
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/categories'); 
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching offenses:', error);
        }
        };
        fetchCategories();
    }, []);


    // Fetch subcategories from the backend
    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/subcategories'); 
            setSubcategories(response.data);
            } catch (error) {
            console.error('Error fetching subcategories:', error);
            }
        };
        fetchSubcategories();
        }, []);


  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };


  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { category, subcategory, status });
  };


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { category, subcategory, status, [field]: value };

    // Update individual filter states
    if (field === 'category') setCategory(value);
    if (field === 'subcategory') setSubcategory(value);
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
    setCategory('');
    setSubcategory('');
    setStatus('');
    onFilterChange({ category: '', subcategory: '', status: '' });
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
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filterSelect"
            >
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="filterOption">
            <select
              value={subcategory}
              onChange={(e) => handleFilterChange('subcategory', e.target.value)}
              className="filterSelect"
            >
              <option value="">Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.subcategory_id} value={subcategory.subcategory_name}>
                  {subcategory.subcategory_name}
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
