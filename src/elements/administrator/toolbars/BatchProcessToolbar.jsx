import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure you have this import

const BatchProcessToolbar = ({ selectedItemsCount, onEdit, onDelete }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null; // Hide the toolbar when closed

  return (
    <div style={styles.toolbar}>
      <button style={styles.closeButton} onClick={handleClose}>
        &times;
      </button>
      <div style={styles.content}>
        <span style={styles.itemCount}>{selectedItemsCount} item(s) selected</span>
        <div style={styles.buttonContainer}>
          <button style={styles.editButton} onClick={onEdit}>
            <i className="fas fa-pen" style={styles.icon}></i> {/* Simpler pen icon */}
            Edit
          </button>
          <button style={styles.deleteButton} onClick={onDelete}>
            <i className="fas fa-trash" style={styles.icon}></i> {/* Trash can icon */}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    width: '600px', // Increased width for a longer rectangle
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '100px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'fixed', // Fixed positioning
    bottom: '20px', // Positioned at the bottom
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)', // Center alignment
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start (left)
    zIndex: 1000, // Ensure it overlaps other elements
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#888',
    marginRight: '15px', // Add margin to space from the text
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontWeight: 'bold',
    marginRight: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '5px', // Space between the buttons
  },
  editButton: {
    backgroundColor: '#E8EBF6', // Changed to specified color
    color: '#4169E1', // Changed text color for edit button
    fontWeight: 'bold', // Make text bold
    border: 'none',
    borderRadius: '30px', // Rounded corners
    padding: '7px 20px', // Adjusted padding for better spacing
    cursor: 'pointer',
    display: 'flex', // Allow icon and text to align properly
    alignItems: 'center', // Center align the icon and text
  },
  deleteButton: {
    backgroundColor: '#F2DFE1', // Changed to specified color
    color: '#DC3545', // Changed text color for delete button
    fontWeight: 'bold', // Make text bold
    border: 'none',
    borderRadius: '30px', // Rounded corners
    padding: '7px 20px', // Adjusted padding for better spacing
    cursor: 'pointer',
    display: 'flex', // Allow icon and text to align properly
    alignItems: 'center', // Center align the icon and text
  },
  icon: {
    marginRight: '8px', // Space between icon and text
  },
};

export default BatchProcessToolbar;
