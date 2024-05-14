import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Assuming these are from 'react-pro-sidebar'
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUsers, FaUserClock, FaUserShield, FaGear } from 'react-icons/fa';
import { IoDocuments, IoFileTrayFull } from 'react-icons/io5';
import { RiFileHistoryFill } from 'react-icons/ri';
import logo from '../../assets/images/norms_logo.png'; // Path to the logo image

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';

export default function CoordinatorAnnouncements() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Render the component if token and role_id are valid
    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title"> ANNOUNCEMENTS </h6>
        </div>
    );
}
