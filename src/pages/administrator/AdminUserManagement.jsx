import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Assuming these are from 'react-pro-sidebar'
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUsers, FaUserClock, FaUserShield, FaGear } from 'react-icons/fa';
import { IoDocuments, IoFileTrayFull } from 'react-icons/io5';
import { RiFileHistoryFill } from 'react-icons/ri';
import logo from '../../assets/images/norms_logo.png'; // Path to the logo image

import AdminNavigation from "./AdminNavigation";

import Students from "../administrator/Students";
import Employees from "../administrator/Employees";

export default function AdminUserManagement() {
    const [selectedComponent, setSelectedComponent] = useState('students');

    const handleComponentChange = (event) => {
        setSelectedComponent(event.target.value);
    };

    return (
        <div>
            <AdminNavigation />
           
            <h6 className="page-title"> USER MANAGEMENT </h6>
            <div>
                <input
                    type="radio"
                    id="students"
                    name="userType"
                    value="students"
                    checked={selectedComponent === 'students'}
                    onChange={handleComponentChange}
                />
                <label htmlFor="students">Students</label>
                <input
                    type="radio"
                    id="employees"
                    name="userType"
                    value="employees"
                    checked={selectedComponent === 'employees'}
                    onChange={handleComponentChange}
                />
                <label htmlFor="employees">Employees</label>
            </div>
            {selectedComponent === 'students' && <Students />}
            {selectedComponent === 'employees' && <Employees />}
        </div>
    );
}
