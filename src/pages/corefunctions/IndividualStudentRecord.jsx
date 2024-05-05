import React, { useState } from 'react';
import UserInfo from '../general/UserInfo';
import SearchAndFilter from './SearchAndFilter';
import { FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import CreateViolationModal from './CreateViolationModal'; // Import CreateViolationModal

export default function IndividualStudentRecord() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateNewRecord = () => {
        // Open the modal when "Add Record" is clicked
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        // Close the modal when the user cancels or submits
        setIsModalOpen(false);
    };

    return (
        <div>
            <UserInfo />
            <div style={{
                height: '200px',
                backgroundColor: 'white',
                border: '1px solid #ccc', // Light gray border color
                padding: '10px',
                marginTop: '100px',
                marginBottom: '20px', // Add margin bottom to separate from search bar
                marginLeft: '100px', // Add left margin
                marginRight: '80px', // Add right margin
                position: 'relative', // Position relative for absolute positioning of photo container
            }}>
                {/* Photo container */}
                <div style={{
                    position: 'absolute', // Position absolute for overlaying
                    top: '20px', // Adjust top position as needed
                    left: '20px', // Adjust left position as needed
                    width: '160px', // Adjust width as needed
                    height: '160px', // Adjust height as needed
                    backgroundColor: 'lightgray', // Background color for the photo container
                    borderRadius: '5px', // Border radius for rounded corners
                }}>
                    {/* Placeholder for photo */}
                    {/* You can add an image or any other content here */}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                {/* Search and filter component */}
                <SearchAndFilter />
                {/* Button to add record */}
                <button 
                    onClick={handleCreateNewRecord} 
                    title="Add Record" // Add title attribute for button
                    style={{
                        backgroundColor: '#FAD32E', // Yellow background color
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 20px', // Increased padding to accommodate the icon
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex', // To align icon and text horizontally
                        alignItems: 'center', // To align icon and text vertically
                        marginLeft: '10px', // Add margin between search and button
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow effect
                    }}
                >
                    Add Record
                    <FaPlus style={{ marginLeft: '5px' }} /> {/* Plus icon */}
                </button>
            </div>
            {/* Render the CreateViolationModal component conditionally */}
            {isModalOpen && <CreateViolationModal isOpen={isModalOpen} onClose={handleCloseModal} />}
        </div>
    );
}
