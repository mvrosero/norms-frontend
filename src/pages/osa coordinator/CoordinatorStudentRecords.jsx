import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import StudentRecordsTable from '../../elements/osa coordinator/tables/StudentRecordsTable';
import SearchAndFilter from '../general/SearchAndFilter';
import CreateViolationModal from '../../elements/osa coordinator/modals/CreateViolationModal';

export default function CoordinatorStudentRecords() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

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
                    Create Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <StudentRecordsTable searchQuery={searchQuery} />

            {/* Modal for creating new record */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title style = {{marginLeft: '35px'}}>CREATE VIOLATION RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Render ViolationRecordForm component within the modal */}
                    <CreateViolationModal handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
}
