import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";
import SearchAndFilter from '../general/SearchAndFilter';
import UserDropdownButton from '../../components/Button/UserDropdownButton';
import Students from "../administrator/Students";
import Employees from "../administrator/Employees";
import ImportCSVButton from '../../components/Button/ImportCSVButton';

export default function AdminUserManagement() {
    const [selectedComponent, setSelectedComponent] = useState('students');

    const handleComponentChange = (event) => {
        setSelectedComponent(event.target.value);
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title"> USER MANAGEMENT </h6>
            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
                <div style={{ width: '900px', marginLeft: '20px' }}>
                    <SearchAndFilter />
                </div>
                <UserDropdownButton />
                <ImportCSVButton />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                    <input
                        type="radio"
                        id="students"
                        name="userType"
                        value="students"
                        checked={selectedComponent === 'students'}
                        onChange={handleComponentChange}
                        style={{
                            marginRight: '5px',
                            backgroundColor: selectedComponent === 'students' ? 'gray' : 'white',
                            border: '1px solid gray',
                            cursor: 'pointer',
                        }}
                    />
                    <label htmlFor="students" style={{ color: 'gray', cursor: 'pointer' }}>Students</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="radio"
                        id="employees"
                        name="userType"
                        value="employees"
                        checked={selectedComponent === 'employees'}
                        onChange={handleComponentChange}
                        style={{
                            marginRight: '5px',
                            backgroundColor: selectedComponent === 'employees' ? 'gray' : 'white',
                            border: '1px solid gray',
                            cursor: 'pointer',
                        }}
                    />
                    <label htmlFor="employees" style={{ color: 'gray', cursor: 'pointer' }}>Employees</label>
                </div>
            </div>
            {selectedComponent === 'students' && <Students />}
            {selectedComponent === 'employees' && <Employees />}
        </div>
    );
}
