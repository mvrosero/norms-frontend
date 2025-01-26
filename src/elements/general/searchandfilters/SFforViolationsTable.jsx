import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiEqualizerLine } from "react-icons/ri";
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforViolationsTable({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [academic_year, setAcadYear] = useState('');
  const [semester, setSemester] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [academic_years, setAcadYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/categories');
        console.log(response.data); // Log to verify structure
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Fallback to an empty array
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAcadYears = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/academic_years');
        setAcadYears(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching academic years:', error);
        setAcadYears([]);
      }
    };
    fetchAcadYears();
  }, []);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('https://test-backend-api-2.onrender.com/semesters');
        setSemesters(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setSemesters([]);
      }
    };
    fetchSemesters();
  }, []);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    triggerSearch(query);
  };

  const triggerSearch = (query) => {
    onSearch(query, { category, academic_year, semester });
  };

  const handleFilterChange = (field, value) => {
    const updatedFilters = {
      category: field === 'category' ? value : category,
      academic_year: field === 'academic_year' ? value : academic_year,
      semester: field === 'semester' ? value : semester,
    };

    if (field === 'category') setCategory(value);
    if (field === 'academic_year') setAcadYear(value);
    if (field === 'semester') setSemester(value);

    onFilterChange(updatedFilters);
    triggerSearch(searchQuery);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsFilterActive(!isFilterActive);
  };

  const clearFilters = () => {
    setCategory('');
    setAcadYear('');
    setSemester('');
    onFilterChange({ category: '', academic_year: '', semester: '' });
  };

  return (
    <div className="searchAndFilterContainer">
      <div className="searchAndFilterWrapper">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange} className="searchInput" />
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
              value={academic_year}
              onChange={(e) => handleFilterChange('academic_year', e.target.value)}
              className="filterSelect"
            >
              <option value="">Academic Year</option>
              {academic_years.map((academic_year) => (
                <option key={academic_year.academic_year} value={academic_year.academic_year}>
                  {academic_year.academic_year}
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
              {semesters.map((semester) => (
                <option key={semester.semester_id} value={semester.semester_name}>
                  {semester.semester_name}
                </option>
              ))}
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
