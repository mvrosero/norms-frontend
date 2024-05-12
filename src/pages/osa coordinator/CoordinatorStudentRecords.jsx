import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import Students from './Students';
import SearchAndFilter from '../general/SearchAndFilter';

import CreateViolationRecordForm from './CreateViolationRecord';

export default function CoordinatorStudentRecords() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
    const navigate = useNavigate();

    const handleCreateNewRecord = () => {
        setShowModal(true); // Show the modal when creating a new record
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide the modal
    };

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title"> STUDENT RECORDS </h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter setSearchQuery={setSearchQuery} />
                <button 
                    onClick={handleCreateNewRecord} 
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Add Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <Students searchQuery={searchQuery} />

            {/* Modal for creating new record */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Violation Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Render ViolationRecordForm component within the modal */}
                    <CreateViolationRecordForm handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
}
