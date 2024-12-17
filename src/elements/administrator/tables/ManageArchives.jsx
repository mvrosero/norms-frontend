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
            <h6 className="page-title">ARCHIVED STUDENTS</h6>
                <div style={{ width: '1100px', marginLeft: '100px' }}>
                    <SearchAndFilter />
                </div>
            <ArchivesTable />
        </div>
    );
}
