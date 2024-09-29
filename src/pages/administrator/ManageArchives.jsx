import React, { useState } from 'react';

import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManageArchives() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title">Manage Archives</h6>
            <SearchAndFilter />
        </div>
    );
}
