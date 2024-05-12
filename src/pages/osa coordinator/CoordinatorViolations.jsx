import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; 


import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import VRtable from "./IndividualViolationRecordsTable";

export default function CoordinatorViolations() {
    const [isCreateViolationModalOpen, setIsCreateViolationModalOpen] = useState(false);

    const handleAddViolation = () => {
        setIsCreateViolationModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsCreateViolationModalOpen(false);
    };

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title"> VIOLATIONS </h6>
            <div style={{ display: 'flex', alignItems: 'center', margin: '40px' }}>
                <SearchAndFilter />
           
                <button 
                    onClick={handleAddViolation} 
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
                    Add
                    <FaPlus style={{ marginLeft: '10px' }} /> {/* Plus icon */}
                </button>
            </div>
            <VRtable />
        </div>
    );
}
