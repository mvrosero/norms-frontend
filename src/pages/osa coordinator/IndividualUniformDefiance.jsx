import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import { FaPlus } from 'react-icons/fa';
import defaultProfile from '../../assets/images/default_profile.jpg'; // Adjust path as necessary
import { format } from 'date-fns';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import AddUniformDefianceModal from '../../elements/osa coordinator/modals/AddUniformDefianceModal';
import ViewUniformDefianceModal from '../../elements/osa coordinator/modals/ViewUniformDefianceModal';

const IndividualUniformDefiance = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [defiances, setDefiances] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [employees, setEmployees] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchStudentInfo = useCallback(async (student_idnumber) => {
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
    }, [headers]);

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
            const student_idnumber = location.pathname.split('/').pop();
            await fetchStudentInfo(student_idnumber);
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
    }, [headers, location.pathname, fetchStudentInfo, fetchEmployeeName]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
    };

    const handleCloseAddViolationModal = async () => {
        setShowAddViolationModal(false);
        await fetchDefiances();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'MM-dd-yyyy, HH:mm:ss');
    };

    return (
        <>
            <CoordinatorNavigation />
            <CoordinatorInfo />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'white', marginTop: '80px', marginBottom: '20px', marginLeft: '100px', marginRight: '50px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '1080px', boxSizing: 'border-box' }}>
                    {studentInfo && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={studentInfo.profilePhoto}
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '5px', margin: '20px', objectFit: 'cover' }}
                                onError={(e) => {
                                    console.error('Error loading image:', e.target.src);
                                    e.target.src = defaultProfile; // Fallback to default image on error
                                }}
                            />
                            <div style={{ marginLeft: '20px', fontSize: '16px' }}>
                                <p><strong>Student ID Number:</strong> {studentInfo.student_idnumber}</p>
                                <p><strong>Name:</strong> {studentInfo.fullName}</p>
                                <p><strong>Email:</strong> {studentInfo.email}</p>
                                <p><strong>Department:</strong> {studentInfo.department_name}</p>
                                <p><strong>Program:</strong> {studentInfo.program_name}</p>
                                <p><strong>Year Level:</strong> {studentInfo.year_level}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <SearchAndFilter setSearchQuery={setSearchQuery} style={{ flex: 1 }} />
                    <Button
                        onClick={() => setShowAddViolationModal(true)} // Show modal on click
                        title="Add Record"
                        style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginLeft: '10px' }}
                    >
                        Add Violation
                        <FaPlus style={{ marginLeft: '2px' }} />
                    </Button>
                </div>

                <Table bordered hover style={{ borderRadius: '20px', marginTop: '20px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Nature of Violation</th>
                            <th>Created At</th>
                            <th>Submitted By</th>
                            <th>File Attached</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defiances.map((defiance, index) => (
                            <tr key={defiance.slip_id}> {/* Use a unique identifier */}
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{defiance.student_idnumber}</td>
                                <td>{defiance.nature_name}</td>
                                <td>{formatDate(defiance.created_at)}</td>
                                <td>{employees[defiance.submitted_by] || defiance.submitted_by}</td>
                                <td>
                                    <div 
                                        className="d-flex align-items-center" 
                                        style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }} 
                                        onClick={() => handleShowDetailsModal(defiance)}
                                    >
                                        View
                                    </div>
                                </td>
                                <td>{defiance.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Show the ViewUniformDefianceModal when selectedRecord is set */}
            {selectedRecord && (
                <ViewUniformDefianceModal
                    show={!!selectedRecord}
                    onHide={() => setSelectedRecord(null)}
                    record={selectedRecord}
                />
            )}

            {/* Add Violation Modal */}
            <AddUniformDefianceModal
                show={showAddViolationModal} // Show modal based on state
                handleCloseModal={handleCloseAddViolationModal} // Close modal on action
            />
        </>
    );
};

export default IndividualUniformDefiance;
