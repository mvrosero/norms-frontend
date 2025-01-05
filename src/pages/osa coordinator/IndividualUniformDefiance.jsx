import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';  // Import useParams
import { FaPlus } from 'react-icons/fa';
import defaultProfile from '../../components/images/default_profile.jpg';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import AddUniformDefianceModal from '../../elements/osa coordinator/modals/AddUniformDefianceModal';
import ViewIndividualUniformDefianceModal from '../../elements/osa coordinator/modals/ViewIndividualUniformDefianceModal';
import IndividualUniformDefianceTable from '../../elements/osa coordinator/tables/IndividualUniformDefianceTable';
import ExportIndividualDefianceCSV from '../../elements/general/exports/ExportIndividualDefianceCSV';

const IndividualUniformDefiance = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [defiances, setDefiances] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [employees, setEmployees] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const { student_idnumber } = useParams();  // Extract student_idnumber from URL params

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchStudentInfo = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9000/student/${student_idnumber}`, { headers });
            const studentData = response.data[0];
            if (studentData) {
                const fullName = `${studentData.first_name} ${studentData.last_name}`.trim();
                const photoFilename = studentData.profile_photo_filename;
                const photoUrl = photoFilename
                    ? `http://localhost:9000/uploads/profile_photo/${photoFilename}`
                    : defaultProfile;

                setStudentInfo({
                    ...studentData,
                    fullName,
                    profilePhoto: photoUrl
                });
            }
        } catch (error) {
            console.error('Error fetching student info:', error);
        }
    }, [student_idnumber, headers]);

    const fetchEmployeeName = useCallback(async (employee_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/employees/${employee_idnumber}`, { headers });
            if (response.data && response.data.name) {
                return response.data.name;
            }
        } catch (error) {
            console.error('Error fetching employee name:', error);
        }
        return employee_idnumber; // Fallback to employee_idnumber if name not found
    }, [headers]);

    const fetchDefiances = useCallback(async () => {
        try {
            await fetchStudentInfo();
            const response = await axios.get(`http://localhost:9000/uniform_defiances/${student_idnumber}`, { headers });

            const nonPendingDefiances = response.data.filter(defiance => defiance.status !== 'Pending');
            setDefiances(nonPendingDefiances);

            // Fetch employee names
            const employeeIds = new Set(response.data.map(defiance => defiance.submitted_by));
            const employeeNames = {};
            for (const id of employeeIds) {
                const name = await fetchEmployeeName(id);
                employeeNames[id] = name;
            }
            setEmployees(employeeNames);
        } catch (error) {
            console.error('Error fetching defiances:', error);
        }
    }, [student_idnumber, fetchStudentInfo, fetchEmployeeName, headers]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
    };

    const handleCloseAddViolationModal = async () => {
        setShowAddViolationModal(false);
        await fetchDefiances(); // Fetch the updated defiances
    };

    return (
        <>
        <CoordinatorNavigation />
        <CoordinatorInfo />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Individual Uniform Defiance</h6>
            </div>

            {/* Student Profile Section */}
            <div style={{ backgroundColor: 'white', marginTop: '20px', marginBottom: '20px', marginLeft: '100px', marginRight: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '1080px', boxSizing: 'border-box' }}>
                {studentInfo && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '130px', height: '130px', borderRadius: '5px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                            <img
                                src={studentInfo.profilePhoto}
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

            
            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginLeft: '60px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SearchAndFilter /> </div>
                <Button
                    onClick={() => setShowAddViolationModal(true)} // Show modal on click
                    title="Add Record"
                    style={{ marginRight: '10px', backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    Add Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
                <ExportIndividualDefianceCSV student_idnumber={student_idnumber} />
            </div>


            {/* Table Section */}
            <IndividualUniformDefianceTable 
                defiances={defiances.filter(defiance => 
                    defiance.student_idnumber.includes(searchQuery) || 
                    defiance.nature_name.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                employees={employees}
                handleShowDetailsModal={handleShowDetailsModal}
            />
            </div>

            <AddUniformDefianceModal
                show={showAddViolationModal}
                onHide={handleCloseAddViolationModal} 
                handleCloseModal={handleCloseAddViolationModal} // Ensure this function is passed correctly
                studentInfo={studentInfo} // Pass student info to modal
            />

            {selectedRecord && (
                <ViewIndividualUniformDefianceModal
                    show={Boolean(selectedRecord)}
                    onHide={() => setSelectedRecord(null)}
                    selectedRecord={selectedRecord}
                />
            )}
        </>
    );
};

export default IndividualUniformDefiance;
