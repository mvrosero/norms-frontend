import React, { useState } from 'react';

export default function SearchAndFilter({ onSearch }) {
    const [keyword, setKeyword] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setKeyword(value);
        onSearch(value);
    };

    return (
        <div style={{ margin: '20px' }}>
            <input
                type="text"
                value={keyword}
                onChange={handleChange}
                placeholder="Search announcements..."
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
    );
}
