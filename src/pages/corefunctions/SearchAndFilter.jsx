import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Added FaSearch

export default function SearchAndFilter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    const handleSearch = () => {
        // Implement your search logic here
        console.log('Search query:', searchQuery);
        console.log('Filter option:', filterOption);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center'}}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        marginLeft: '100px',
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
                    onChange={(e) => setFilterOption(e.target.value)}
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
                    onClick={handleSearch} 
                    style={{
                        padding: '11px 14px 11px 14px', // Same height as search input
                        backgroundColor: '#FAD32E', // Blue background color
                        color: '#fff', // White text color
                        border: 'none', // No border
                        borderRadius: '0 10px 10px 0', // Border radius for right corners only
                        cursor: 'pointer', // Pointer cursor
                    }}
                >
                    <FaSearch style={{ width: '20px', height: '20px' }} /> {/* Adjust width and height of search icon */}
                </button>
            </div>
        </div>
    );
}
