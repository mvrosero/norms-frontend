import React from 'react';
import { FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Assuming these are from 'react-pro-sidebar'
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUsers, FaUserClock, FaUserShield, FaGear } from 'react-icons/fa';
import { IoDocuments, IoFileTrayFull } from 'react-icons/io5';
import { RiFileHistoryFill } from 'react-icons/ri';
import logo from '../../assets/images/norms_logo.png'; // Path to the logo image

import SecurityNavigation from './SecurityNavigation';
import UserInfo from "../general/UserInfo";
import SeachAndFilter from '../corefunctions/SearchAndFilter';

export default function SecurityUniformDefiance() {
    const handleCreateNewRecord = () => {
        // Implement your logic for creating a new record
        console.log('Creating new record...');
    };

    return (
        <div>
            <SecurityNavigation />
            <UserInfo />
            <h6 className="page-title"> UNIFORM DEFIANCE </h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SeachAndFilter/>
                <button 
                    onClick={handleCreateNewRecord} 
                    style={{
                        backgroundColor: '#FAD32E', // Yellow background color
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px', // Increased padding to accommodate the icon
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px', // Add margin to separate search/filter and button
                        display: 'flex', // To align icon and text horizontally
                        alignItems: 'center', // To align icon and text vertically
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow effect
                    }}
                >
                      Add New
                    <FaPlus style={{ marginLeft: '10px' }} /> {/* Plus icon */}
                </button>
            </div>
        </div>
    );
}
