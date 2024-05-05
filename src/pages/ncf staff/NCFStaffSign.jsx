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

export default function NCFStaffSign() {
    const navigate = useNavigate();

    const handleViewPending = () => {
        navigate('/ncfstaff-onlineclearance');
    };

    return (
        <div>
            <NCFStaffNavigation />
            <UserInfo />
            <h6 className="page-title" style={{ marginRight: '10px' }}> SIGN CLEARANCES </h6>
            <div style={{ display: 'flex', alignItems: 'center', margin: '40px' }}>
                <SeachAndFilter />
                <button 
                    onClick={handleViewPending} 
                    style={{
                        backgroundColor: '#FAD32E', // Yellow background color
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 30px', // Increased padding to accommodate the icon
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px', // Add margin to separate search/filter and button
                        display: 'flex', // To align icon and text horizontally
                        alignItems: 'center', // To align icon and text vertically
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow effect
                    }}
                >
                    View All
                </button>
            </div>
        </div>
    );
}
