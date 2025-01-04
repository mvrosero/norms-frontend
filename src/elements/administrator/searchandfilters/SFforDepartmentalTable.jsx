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
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [programs, setPrograms] = useState([]); // State for storing program options
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 31 }, (_, index) => currentYear - 5 + index);

    // Fetch programs dynamically
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

    // Handle the search input change and call the onSearch function
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Call the onSearch function with current values of the filters
        onSearch(query, { yearLevel, program, batch, status });
    };

    // Handle filter changes and call the onSearch function
    const handleFilterChange = (filter, value) => {
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
        // Call the onSearch function with the updated filter values
        onSearch(searchQuery, { yearLevel: value, program, batch, status });
    };

    const toggleFilterDropdown = () => {
        setIsFilterOpen(!isFilterOpen);
        setIsFilterActive(!isFilterActive);
    };

    const clearFilters = () => {
        setYearLevel('');
        setProgram('');
        setBatch('');
        setStatus('');
        // Call the onSearch function with an empty set of filters
        onSearch(searchQuery, { yearLevel: '', program: '', batch: '', status: '' });
    };

    return (
        <div className="searchAndFilterContainer">
            <div className="searchAndFilterWrapper">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchInput"
                />
                <button
                    onClick={toggleFilterDropdown}
                    className={`filterButton ${isFilterActive ? 'active' : ''}`}
                >
                    <IoFilter className={`filterIcon ${isFilterActive ? 'active' : ''}`} />
                </button>
                <button
                    onClick={() => onSearch(searchQuery, { yearLevel, program, batch, status })}
                    className="searchButton"
                >
                    <FaSearch className="searchIcon" />
                </button>
            </div>

            {isFilterOpen && (
                <div className="filterDropdownWrapper">
                    <div className="filterOption">
                        <select
                            value={yearLevel}
                            onChange={(e) => setFilterCriteria('yearLevel', e.target.value)}
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
                            onChange={(e) => setFilterCriteria('program', e.target.value)}
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
                            id="batch"
                            value={batch}
                            onChange={(e) => setFilterCriteria('batch', e.target.value)}
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
                            onChange={(e) => setFilterCriteria('status', e.target.value)}
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
