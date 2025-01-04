import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import axios from 'axios';
import '../../../styles/SearchAndFilter.css';

export default function SFforDepartmentalTable({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [program, setProgram] = useState('');
    const [batch, setBatch] = useState('');
    const [status, setStatus] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [programs, setPrograms] = useState([]);
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 31 }, (_, index) => currentYear - 5 + index);

    useEffect(() => {
        axios
            .get('http://localhost:9000/programs')
            .then((response) => {
                setPrograms(response.data);
            })
            .catch((error) => {
                console.error('Error fetching programs:', error);
            });
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Passing the search query along with current filters
        onSearch(value, { yearLevel, program, batch, status });
    };

    const handleFilterChange = (filter, value) => {
        const updatedFilters = { yearLevel, program, batch, status, [filter]: value };

        switch (filter) {
            case 'yearLevel':
                setYearLevel(value);
                break;
            case 'program':
                setProgram(value);
                break;
            case 'batch':
                setBatch(value);
                break;
            case 'status':
                setStatus(value);
                break;
            default:
                break;
        }

        // Passing search query with updated filters
        if (onSearch) {
            onSearch(searchQuery, updatedFilters);
        }
    };

    const toggleFilterDropdown = () => {
        setIsFilterOpen((prevState) => !prevState);
    };

    const clearFilters = () => {
        setYearLevel('');
        setProgram('');
        setBatch('');
        setStatus('');
        // Clear filters when resetting and maintain the search query
        if (onSearch) {
            onSearch(searchQuery, { yearLevel: '', program: '', batch: '', status: '' });
        }
    };

    return (
        <div className="searchAndFilterContainer">
            <div className="searchAndFilterWrapper">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search users by name or ID"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="searchInput"
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                    }}
                />
                {/* Filter Toggle Button */}
                <button onClick={toggleFilterDropdown} className="filterButton">
                    <IoFilter className="filterIcon" />
                </button>
                {/* Search Button */}
                <button
                    onClick={() => onSearch(searchQuery, { yearLevel, program, batch, status })}
                    className="searchButton"
                >
                    <FaSearch className="searchIcon" />
                </button>
            </div>

            {/* Filter Dropdown */}
            {isFilterOpen && (
                <div className="filterDropdownWrapper">
                    {/* Year Level Filter */}
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
                    {/* Program Filter */}
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
                    {/* Batch Filter */}
                    <div className="filterOption">
                        <select
                            id="batch"
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
                    {/* Status Filter */}
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

                    {/* Clear Filters Button */}
                    <button className="clearButton" onClick={clearFilters}>
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
