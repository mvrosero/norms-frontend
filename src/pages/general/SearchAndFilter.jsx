import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import FaSearch icon

export default function SearchAndFilter({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    // Handle the input change and perform search
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        onSearch(e.target.value, filterOption); // Call the parent component's search handler with the current query
    };

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
        onSearch(searchQuery, e.target.value); // Call the parent component's search handler with the updated filter
    };

    return (
        <div style={{ margin: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleInputChange} // Update search results as the user types
                    style={{
                        padding: '12px', // Larger height
                        width: '750px', // Shorter width
                        backgroundColor: '#ffffff', // White background color
                        boxShadow: 'inset 1px 0 5px 1px rgba(0, 0, 0, 0.2)', // Inner shadow
                        borderRadius: '10px 0 0 10px', // Border radius for left corners only
                        border: 'none', // No border
                        outline: 'none', // No outline
                    }}
                />
                <select
                    value={filterOption}
                    onChange={handleFilterChange} // Update search results when filter option changes
                    style={{
                        padding: '14px', // Same height as search input
                        backgroundColor: '#ffffff', // White background color
                        boxShadow: 'inset 1px 0 5px 1px rgba(0, 0, 0, 0.2)', // Inner shadow
                        borderRadius: '0', // No border radius
                        border: 'none', // No border
                        outline: 'none', // No outline
                        width: '120px', // Larger width for the filter dropdown
                    }}
                >
                    <option value="all">All</option>
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                    {/* Add more filter options as needed */}
                </select>
                <button
                    onClick={() => onSearch(searchQuery, filterOption)} // Optional: Handle search button click if needed
                    style={{
                        padding: '11px 14px', // Same height as search input
                        backgroundColor: '#FAD32E', // Yellow background color
                        color: '#fff', // White text color
                        border: 'none', // No border
                        borderRadius: '0 10px 10px 0', // Border radius for right corners only
                        cursor: 'pointer', // Pointer cursor
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FaSearch style={{ width: '20px', height: '20px' }} /> {/* Adjust width and height of search icon */}
                </button>
            </div>
        </div>
    );
}
