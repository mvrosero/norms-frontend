import React, { useState } from 'react';

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
        <button style={styles.editButton} onClick={onEdit}>
          Edit
        </button>
        <button style={styles.deleteButton} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    width: '400px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    margin: '20px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#888',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    marginRight: '20px',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
  },
};

export default BatchProcessToolbar;
