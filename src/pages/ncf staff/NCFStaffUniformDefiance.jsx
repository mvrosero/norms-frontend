import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Assuming these are from 'react-pro-sidebar'
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUsers, FaUserClock, FaUserShield, FaGear } from 'react-icons/fa';
import { IoDocuments, IoFileTrayFull } from 'react-icons/io5';
import { RiFileHistoryFill } from 'react-icons/ri';
import logo from '../../assets/images/norms_logo.png'; // Path to the logo image

import NCFStaffNavigation from './NCFStaffNavigation';
import UserInfo from "../general/UserInfo";
import SeachAndFilter from '../corefunctions/SearchAndFilter';

export default function NCFStaffUniformDefiance() {   
    return (
        <div>
            <NCFStaffNavigation />
            <UserInfo />
            <h6 className="page-title" style={{ marginRight: '10px' }}> UNIFORM DEFIANCE </h6>
            <div style={{ display: 'flex', alignItems: 'center', margin: '40px', marginLeft: '90px' }}>
                <div style={{ width: '100%', maxWidth: '3000px' }}> {/* Adjust maxWidth according to your preference */}
                    <SeachAndFilter />
                </div>
            </div>
        </div>
    );
}
