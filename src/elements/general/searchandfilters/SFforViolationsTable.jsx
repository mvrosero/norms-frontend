import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforViolationsTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [offense, setOffense] = useState('');
  const [acadyear, setAcadYear] = useState('');
  const [semester, setSemester] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [acadyears, setAcadYears] = useState([]);
  const [semesters, setSemesters] = useState([]);


  // Fetch programs from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/categories'); 
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);


  // Fetch offenses grouped by the selected category
    useEffect(() => {
        const fetchOffenses = async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/offenses-by-category');
            setOffenses(response.data);
        } catch (error) {
            console.error('Error fetching offenses by category:', error);
        }
        };
        fetchOffenses();
    }, []);
  

// Fetch academic years from the backend
  useEffect(() => {
    const fetchAcadYears = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/academicyears'); 
        setAcadYears(response.data);
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    };
    fetchAcadYears();
  }, []);


  // Fetch semesters from the backend
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/semesters'); 
        setSemesters(response.data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };
    fetchSemesters();
  }, []);



  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };


  // Trigger search with current query and filters
  const triggerSearch = (query) => {
    onSearch(query, { category, offense, acadyear, semester });
  };


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const updatedFilters = { category, offense, acadyear, semester, [field]: value };

    // Update individual filter states
    if (field === 'category') setCategories(value);
    if (field === 'offense') setOffenses(value);
    if (field === 'acadyear') setAcadYears(value);
    if (field === 'semester') setSemesters(value);

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
    setCategories('');
    setOffenses('');
    setAcadYears('');
    setSemesters('');
    onFilterChange({ category: '', offense: '', acadyear: '', semester: '' });
  };


  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange} className="searchInput"/>
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
              value={offense}
              onChange={(e) => handleFilterChange('offense', e.target.value)}
              className="filterSelect"
            >
              <option value="">Offense</option>
              {offenses.map((offense) => (
                <option key={offense.offense_id} value={offense.offense_name}>
                  {offense.offense_name}
                </option>
              ))}
            </select>
          </div>

          <div className="filterOption">
            <select
                value={acadyear}
                onChange={(e) => handleFilterChange('acadyear', e.target.value)}
                className="filterSelect"
            >
                <option value="">Academic Year</option>
                {acadyears.map((year, index) => (
                <option key={index} value={year.formatted_year}>
                    {year.formatted_year}
                </option>
                ))}
            </select>
            </div>

          <div className="filterOption">
                <select
                value={semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="filterSelect"
                >
                <option value="">Semester</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
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

