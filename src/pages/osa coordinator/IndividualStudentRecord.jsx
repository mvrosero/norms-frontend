import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; 
import SearchAndFilter from '../general/SearchAndFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai'; 

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import IndividualViolationRecordsTable from './IndividualViolationRecordsTable';
import AddViolationRecordForm from './AddViolationRecord';

export default function IndividualStudentRecord() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [violationRecords, setViolationRecords] = useState([]);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false); // State for managing the Add Violation modal
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch student info function
    const fetchStudentInfo = async (student_idnumber) => {
        try {
            const studentResponse = await axios.get(`http://localhost:9000/student/${student_idnumber}`);
            setStudentInfo(studentResponse.data[0]);
      
            // Fetch violation records specific to the student
            const violationResponse = await axios.get(`http://localhost:9000/violation_record/${student_idnumber}`);
            setViolationRecords(violationResponse.data);
        } catch (error) {
            console.error('Error fetching student info:', error);
        }
    };

    useEffect(() => {
        // Check if token and role_id exist in localStorage
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        // If token or role_id is invalid, redirect to unauthorized page
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        } else {
            // If token and role_id are valid, fetch student info
            const student_idnumber = location.pathname.split('/').pop();
            fetchStudentInfo(student_idnumber);
        }
    }, [location.pathname, navigate]);

    const handleCreateNewRecord = () => {
        setShowAddViolationModal(true); // Open the Add Violation modal
    };

    const handleCloseModal = async () => {
        setShowAddViolationModal(false); // Close the Add Violation modal
        // Refetch the violation records data
        const student_idnumber = location.pathname.split('/').pop();
        await fetchStudentInfo(student_idnumber);
    };

    const handleCancel = () => {
        handleCloseModal();
    };
    

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', marginTop: '80px', marginBottom: '20px', marginLeft: '100px', marginRight: '50px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '1080px', boxSizing: 'border-box' }}>
                {studentInfo && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            backgroundColor: 'lightgray',
                            borderRadius: '5px',
                            margin: '20px'
                        }}>
                            {/* You can also display an image here if available */}
                        </div>
                        <div style={{
                            marginLeft: '20px',
                            fontSize: '16px'
                        }}>
                            {/* Display student information */}
                            <p><strong>Student ID Number:</strong> {studentInfo.student_idnumber}</p>
                            <p><strong>Name:</strong> {`${studentInfo.first_name} ${studentInfo.middle_name} ${studentInfo.last_name} ${studentInfo.suffix}`.trim()}</p>
                            <p><strong>Email:</strong> {studentInfo.email}</p>
                            <p><strong>Department:</strong> {studentInfo.department_name}</p>
                            <p><strong>Program:</strong> {studentInfo.program_name}</p>
                            <p><strong>Year Level:</strong> {studentInfo.year_level}</p>
                        </div>
                    </div>
                )}
            </div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginLeft: '30px', marginRight: '10px' }}>
                <SearchAndFilter />
                <button
                    onClick={handleCreateNewRecord}
                    title="Add Record"
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginLeft: '10px'
                    }}
                >
                    Add Violation
                    <FaPlus style={{ marginLeft: '2px' }} />
                </button>
            </div>
            {/* Table for displaying violation records */}
            <div style={{ marginTop: '20px', marginLeft: '20px', marginRight: '30px' }}>
                <IndividualViolationRecordsTable records={violationRecords} />
            </div>
            {/* AddViolationRecordForm modal */}
            <Modal show={showAddViolationModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title style = {{marginLeft: '60px'}}>ADD VIOLATION RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Pass handleCloseModal function as onClose prop */}
                    <AddViolationRecordForm handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
}
