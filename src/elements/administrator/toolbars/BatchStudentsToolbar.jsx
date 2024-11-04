import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import BatchEditStudentModal from '../modals/BatchEditStudentModal';

const BatchStudentsToolbar = ({ selectedItemsCount, onEdit, onDelete, studentIds }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleEdit = () => {
    setIsModalVisible(true); // Show the modal when edit is clicked
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
  };

  if (!isVisible) return null;

  return (
    <div style={styles.toolbar}>
      <button style={styles.closeButton} onClick={handleClose}>
        &times;
      </button>
      <div style={styles.content}>
        <div style={styles.itemInfoContainer}>
          <div style={styles.itemCountContainer}>
            <span style={styles.itemCount}>{selectedItemsCount}</span>
          </div>
          <span style={styles.selectedText}>
            item{selectedItemsCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.editButton} onClick={handleEdit}>
            <i className="fas fa-pen" style={styles.icon}></i> Edit
          </button>
          <button style={styles.deleteButton} onClick={onDelete}>
            <i className="fas fa-trash" style={styles.icon}></i> Delete
          </button>
        </div>
      </div>

      {/* Batch Edit Student Modal */}
      <BatchEditStudentModal
        show={isModalVisible}
        handleClose={handleModalClose}
        studentIds={studentIds} // Pass selected student IDs to the modal
      />
    </div>
  );
};

const styles = {
  toolbar: {
    width: '600px',
    padding: '15px',
    backgroundColor: '#3B3B3B',
    borderRadius: '100px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1000,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '25px',
    cursor: 'pointer',
    color: '#C1C1C1',
    marginRight: '20px',
    marginLeft: '10px',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginLeft: '20px',
  },
  itemCountContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#C1C1C1',
  },
  itemCount: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'normal',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#E8EBF6',
    color: '#4169E1',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    padding: '7px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F2DFE1',
    color: '#DC3545',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    padding: '7px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  icon: {
    marginRight: '8px',
  },
};

export default BatchStudentsToolbar;
