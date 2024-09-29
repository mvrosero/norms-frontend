import React, { useState } from 'react';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManageNatureOfViolation() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Subcategories</h6>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            {/* Add any additional components or functionality needed for managing nature of violations */}
        </div>
    );
}
