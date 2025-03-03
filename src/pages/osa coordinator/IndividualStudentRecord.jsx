import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { FaPlus } from 'react-icons/fa'; 
import { GoStack } from "react-icons/go";
import { GoHistory } from "react-icons/go";

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforViolationsTable from '../../elements/general/searchandfilters/SFforViolationsTable';
import IndividualStudentRecordTable from '../../elements/osa coordinator/tables/IndividualStudentRecordTable';
import IndividualHistoryViolationRecordTable from '../../elements/osa coordinator/tables/IndividualHistoryViolationRecordTable';
import AddViolationModal from '../../elements/osa coordinator/modals/AddViolationModal';
import defaultProfile from '../../components/images/default_profile.jpg';

export default function IndividualStudentRecord() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(defaultProfile); 
    const [violationRecords, setViolationRecords] = useState([]);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false); 
    const [activeTab, setActiveTab] = useState('stack');
    const location = useLocation();
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allRecords, setAllRecords] = useState([]);  
    const [filteredRecords, setFilteredRecords] = useState([]);  
    const [filters, setFilters] = useState({
        category_name: '',
        academic_year: '',
        semester: '',
    });
    const navigate = useNavigate();
    const { student_idnumber } = useParams(); 


    // Fetch the student information
    const fetchStudentInfo = async (student_idnumber) => {
        try {
            const studentResponse = await axios.get(`https://test-backend-api-2.onrender.com/student/${student_idnumber}`);
            const studentData = studentResponse.data[0];
            setStudentInfo(studentData);

            const photoFilename = studentData?.profile_photo_filename;
            if (photoFilename) {
                const photoUrl = `https://test-backend-api-2.onrender.com/uploads/profile_photo/${photoFilename}`;
                setProfilePhoto(photoUrl);
            }

            // Fetch violation records specific to the student
            const violationResponse = await axios.get(`https://test-backend-api-2.onrender.com/violation_record/${student_idnumber}`);
            setViolationRecords(violationResponse.data);
        } catch (error) {
            console.error('Error fetching student info:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        } else {
            const student_idnumber = location.pathname.split('/').pop();
            fetchStudentInfo(student_idnumber);
        }
    }, [location.pathname, navigate]);


    // Fetch records
    const fetchRecords = useCallback(async () => {
        setLoading(true); 
        setError(false); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`https://test-backend-api-2.onrender.com/individual_violationrecords/${student_idnumber}`, { headers }
            );
            setAllRecords(response.data);
            setFilteredRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error.response || error.message || error);
            setError(true); 
        } finally {
            setLoading(false); 
        }
    }, []);


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
        const normalizedQuery = query ? query.toLowerCase() : '';
    
        const filtered = allRecords.filter(record => {
            const offense = record.offense_name ? record.offense_name.toLowerCase() : ''; 
            return offense.includes(normalizedQuery);
        });
        setFilteredRecords(filtered);  
    };


    // Handle filter changes 
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allRecords;
    
        // Apply filters one by one
        if (filters.category_name) {
            filtered = filtered.filter(record => record.category_name === filters.category_name);
        }

        if (filters.academic_year) {
            filtered = filtered.filter(record => record.academic_year === filters.academic_year);
        }
        
        if (filters.semester_name) {
            filtered = filtered.filter(record => record.semester_name === filters.semester_name);
        }
    
        setFilteredRecords(filtered);
    };
    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);


    const handleCreateNewRecord = () => {
        setShowAddViolationModal(true); 
    };

    const handleCloseModal = async () => {
        setShowAddViolationModal(false); 
        const student_idnumber = location.pathname.split('/').pop();
        await fetchStudentInfo(student_idnumber);
    };

    // Handle icon click to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CoordinatorNavigation />
        <CoordinatorInfo />

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
                                <div style={{ width: '60%' }}>
                                    <p><strong>Student ID Number:</strong> {studentInfo.student_idnumber}</p>
                                </div>
                                <div style={{ width: '40%', whiteSpace: 'nowrap', }}>
                                    <p><strong>Department:</strong> {studentInfo.department_name}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px' }}>
                                <div style={{ width: '60%' }}>
                                    <p><strong>Name:</strong> {`${studentInfo.first_name} ${studentInfo.middle_name} ${studentInfo.last_name} ${studentInfo.suffix}`.trim()}</p>
                                </div>
                                <div style={{ width: '40%', whiteSpace: 'nowrap', }}>
                                    <p><strong>Program:</strong> {studentInfo.program_name}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px' }}>
                                <div style={{ width: '60%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p style={{ marginRight: '10px' }}> <strong>Email:</strong> </p>
                                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${studentInfo.email}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#4682B4' }}> {studentInfo.email} </a></div>
                                </div>
                                <div style={{ width: '40%' }}>
                                    <p><strong>Year Level:</strong> {studentInfo.year_level}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ width: '60%', whiteSpace: 'nowrap', }}>
                                    <p><strong>Status:</strong><div style={{ backgroundColor: studentInfo.status === 'active' ? '#DBF0DC' : '#F0DBDB', color: studentInfo.status === 'active' ? '#30A530' : '#D9534F', fontWeight: '600', fontSize: '14px', borderRadius: '30px', padding: '5px 20px', display: 'inline-flex', alignItems: 'center', marginLeft: '10px' }}> {studentInfo.status} </div> </p>
                                </div>
                                <div style={{ width: '40%', whiteSpace: 'nowrap', }}>
                                    <p><strong>Batch:</strong> {studentInfo.batch}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginLeft: '60px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 80%', minWidth: '300px' }}> 
                    <SFforViolationsTable onSearch={handleSearch} onFilterChange={handleFilterChange} /> 
                </div>
                <Button onClick={handleCreateNewRecord} title="Add Record" style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 36px', marginLeft: '20px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} >
                     Add Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
            </div>

            {/* Breadcrumbs and Tab Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', width: '100%', maxWidth: '1080px', marginLeft: '130px', marginRight: 'auto', marginBottom: '5px' }}>
                {/* Breadcrumbs */}
                <nav style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
                        <li style={{ marginRight: '5px' }}>
                            <Link to="/coordinator-studentrecords" style={{ textDecoration: 'none', color: '#0D4809' }}>
                                Student Records
                            </Link>
                        </li>
                        <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                        <li style={{ marginLeft: '5px', color: '#000' }}>Individual Violation Records</li>
                    </ol>
                </nav>
                {/* Tab buttons for History and Stack */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <GoStack size={20} onClick={() => handleTabClick('stack')} style={{ cursor: 'pointer', color: activeTab === 'stack' ? '#134E0F' : '#8C8C8C', marginLeft: '20px' }} />
                    <GoHistory size={20} onClick={() => handleTabClick('history')} style={{ cursor: 'pointer', color: activeTab === 'history' ? '#134E0F' : '#8C8C8C', marginLeft: '10px' }} />
                </div>
            </div>
                {/* Conditionally render the tables based on active tab */}
                {activeTab === 'stack' ? (
                    <IndividualStudentRecordTable 
                        records={violationRecords} 
                        filteredRecords={filteredRecords}  
                        filters={filters}  
                        searchQuery={searchQuery}/>
                ) : (
                    <IndividualHistoryViolationRecordTable 
                        filteredRecords={filteredRecords}  
                        filters={filters}  
                        searchQuery={searchQuery}/>
                )}
       
            {/* Add Individual Violation Record Modal */}
            <AddViolationModal
                show={showAddViolationModal}
                onHide={handleCloseModal}
                handleCloseModal={handleCloseModal}
            />
        </div>
    );
}
