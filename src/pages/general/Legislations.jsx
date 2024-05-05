import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Assuming these are from 'react-pro-sidebar'
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUsers, FaUserClock, FaUserShield, FaGear } from 'react-icons/fa';
import { IoDocuments, IoFileTrayFull } from 'react-icons/io5';
import { RiFileHistoryFill } from 'react-icons/ri';
import logo from '../../assets/images/norms_logo.png'; // Path to the logo image

import StudentNavigation from '../student/StudentNavigation';
import UserInfo from "../general/UserInfo";


export default function Legislations() {
    return (
        <div>
            <StudentNavigation />
            <UserInfo />
            <h6 className="page-title"> LEGISLATIONS </h6>
        </div>
    );
}
