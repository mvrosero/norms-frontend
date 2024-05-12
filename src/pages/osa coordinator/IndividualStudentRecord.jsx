import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; 
import SearchAndFilter from '../general/SearchAndFilter';
import { useLocation } from 'react-router-dom';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import IndividualViolationRecordsTable from './IndividualViolationRecordsTable';


export default function IndividualStudentRecord() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null);
    const [violationRecords, setViolationRecords] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const user_id = location.pathname.split('/').pop();
                const studentResponse = await axios.get(`http://localhost:9000/student/${user_id}`);
                setStudentInfo(studentResponse.data[0]);
          
                // Fetch violation records specific to the student
                const violationResponse = await axios.get(`http://localhost:9000/violation_record/${user_id}`);
                setViolationRecords(violationResponse.data);
            } catch (error) {
                console.error('Error fetching student info:', error);
            }
        };
        fetchStudentInfo();
    }, [location.pathname]);

    const handleCreateNewRecord = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
        </div>
    );
}
