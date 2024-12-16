import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";
import SearchAndFilter from '../general/SearchAndFilter';

import StudentsTable from '../../elements/administrator/tables/StudentsTable';
import EmployeesTable from '../../elements/administrator/tables/EmployeesTable';
import ImportStudentsCSV from '../../elements/general/imports/ImportStudentsCSV'; // Import Students CSV component
import ImportEmployeesCSV from '../../elements/general/imports/ImportEmployeesCSV'; // Import Employees CSV component
import UserDropdownButton from '../../elements/general/buttons/UserDropdownButton';

export default function AdminUserManagement() {
    const [selectedComponent, setSelectedComponent] = useState('students');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    const handleComponentChange = (event) => {
        setSelectedComponent(event.target.value);
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title"> USER MANAGEMENT </h6>
            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
                <div style={{ width: '750px', marginLeft: '100px' }}>
                    <SearchAndFilter />
                </div>
                <UserDropdownButton />
                {selectedComponent === 'students' && <ImportStudentsCSV />} {/* Show Import Students CSV component */}
                {selectedComponent === 'employees' && <ImportEmployeesCSV />} {/* Show Import Employees CSV component */}
            </div>


            {/* Radio buttons for selecting user type */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
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

            {/* Display the tables based on selected radio button */}
            {selectedComponent === 'students' && <StudentsTable />} {/* Show Students Table */}
            {selectedComponent === 'employees' && <EmployeesTable />} {/* Show Employees Table */}
        </div>
    );
}
