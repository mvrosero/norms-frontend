import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; 
import SearchAndFilter from '../general/SearchAndFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai'; 

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import IndividualStudentRecordTable from '../../elements/osa coordinator/tables/IndividualStudentRecordTable';
import AddViolationModal from '../../elements/osa coordinator/modals/AddViolationModal';
import defaultProfile from '../../components/images/default_profile.jpg';

export default function IndividualStudentRecord() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(defaultProfile); // State to manage the profile photo
    const [violationRecords, setViolationRecords] = useState([]);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false); // State for managing the Add Violation modal
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch student info function
    const fetchStudentInfo = async (student_idnumber) => {
        try {
            const studentResponse = await axios.get(`http://localhost:9000/student/${student_idnumber}`);
            const studentData = studentResponse.data[0];
            setStudentInfo(studentData);

            // Set profile photo if available
            const photoFilename = studentData?.profile_photo_filename;
            if (photoFilename) {
                const photoUrl = `http://localhost:9000/uploads/profile_photo/${photoFilename}`;
                setProfilePhoto(photoUrl);
            }

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
            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Individual Violation Records</h6>
            </div>

            {/* Student Profile Section */}
            <div style={{ backgroundColor: 'white', marginTop: '20px', marginBottom: '20px', marginLeft: '100px', marginRight: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '1080px', boxSizing: 'border-box' }}>
                {studentInfo && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '130px', height: '130px', borderRadius: '5px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                            <img
                                src={profilePhoto}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                onError={(e) => {
                                    console.error('Error loading image:', e.target.src);
                                    e.target.src = defaultProfile; 
                                }}
                            />
                        </div>

                        {/* Display student information in two columns */}
                        <div style={{ marginLeft: '20px', fontSize: '16px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px' }}>
                                <div style={{ width: '50%' }}>
                                    <p><strong>Student ID Number:</strong> {studentInfo.student_idnumber}</p>
                                </div>
                                <div style={{ width: '50%', whiteSpace: 'nowrap', }}>
                                    <p><strong>Department:</strong> {studentInfo.department_name}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px' }}>
                                <div style={{ width: '50%' }}>
                                    <p><strong>Name:</strong> {`${studentInfo.first_name} ${studentInfo.middle_name} ${studentInfo.last_name} ${studentInfo.suffix}`.trim()}</p>
                                </div>
                                <div style={{ width: '50%', whiteSpace: 'nowrap', }}>
                                    <p><strong>Program:</strong> {studentInfo.program_name}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ width: '50%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p style={{ marginRight: '10px' }}> <strong>Email:</strong> </p>
                                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${studentInfo.email}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#4682B4' }}> {studentInfo.email} </a></div>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <p><strong>Year Level:</strong> {studentInfo.year_level}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CoordinatorNavigation />
            <CoordinatorInfo />

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginLeft: '60px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SearchAndFilter /> </div>
                <Button
                    onClick={handleCreateNewRecord}
                    title="Add Record"
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} >
                    Add Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
            </div>


            {/* Table for displaying violation records */}
                <IndividualStudentRecordTable records={violationRecords} />
       

            {/* Add Individual Violation Record Modal */}
            <AddViolationModal
                show={showAddViolationModal}
                onHide={handleCloseModal}
                handleCloseModal={handleCloseModal}
            />
        </div>
    );
}
