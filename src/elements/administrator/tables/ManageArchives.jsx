import React, { useState } from 'react';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';
import ArchivesTable from './ArchivesTable';

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
            <ArchivesTable />
        </div>
    );
}
