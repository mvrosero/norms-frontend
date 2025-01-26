import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';  
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import defaultProfile from '../../components/images/default_profile.jpg';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforDefianceHistory from '../../elements/osa coordinator/searchandfilters/SFforIndividualDefiance';
import AddUniformDefianceModal from '../../elements/osa coordinator/modals/AddUniformDefianceModal';
import ViewIndividualUniformDefianceModal from '../../elements/osa coordinator/modals/ViewIndividualUniformDefianceModal';
import IndividualUniformDefianceTable from '../../elements/osa coordinator/tables/IndividualUniformDefianceTable';
import ExportIndividualDefianceCSV from '../../elements/general/exports/ExportIndividualDefianceCSV';

const IndividualUniformDefiance = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [defiances, setDefiances] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showAddViolationModal, setShowAddViolationModal] = useState(false);
    const [employees, setEmployees] = useState({});
    const location = useLocation();
    const { student_idnumber } = useParams();  
    const [searchQuery, setSearchQuery] = useState('');
    const [allDefiances, setAllDefiances] = useState([]);  
    const [filteredDefiances, setFilteredDefiances] = useState([]);  
    const [filters, setFilters] = useState({
      nature_name: '',
      filterDate: ''
    });
    const navigate = useNavigate();


    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Fetch the student information
    const fetchStudentInfo = useCallback(async () => {
        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/student/${student_idnumber}`, { headers });
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


    // Fetch the employee information
    const fetchEmployeeName = useCallback(async (employee_idnumber) => {
        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/employees/${employee_idnumber}`, { headers });
            if (response.data && response.data.name) {
                return response.data.name;
            }
        } catch (error) {
            console.error('Error fetching employee name:', error);
        }
        return employee_idnumber; 
    }, [headers]);


    // Fetch uniform defiances specific to the student
    const fetchDefiances = useCallback(async () => {
        try {
            await fetchStudentInfo();
            const response = await axios.get(`https://test-backend-api-2.onrender.com/uniform_defiances/${student_idnumber}`, { headers });

            setDefiances(response.data);
            setAllDefiances(response.data);
            setFilteredDefiances(response.data);

            const nonPendingDefiances = response.data.filter(defiance => defiance.status !== 'pending');
            setDefiances(nonPendingDefiances);

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
        await fetchDefiances(); 
    };



    // Handle search query changes
    const handleSearch = (query) => {
    setSearchQuery(query);
    const normalizedQuery = query ? query.trim().toLowerCase() : '';

    const filtered = allDefiances.filter(defiance => {
        const nature_name = defiance.nature_name ? defiance.nature_name.trim().toLowerCase() : '';
        return nature_name.includes(normalizedQuery);
    });
        setFilteredDefiances(filtered);
    };


    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allDefiances;
    
        // Apply 'nature_name' filter
        if (filters.nature_name) {
            filtered = filtered.filter(defiance => defiance.nature_name === filters.nature_name);
        }
    
        // Apply filter for the selected date (created_at comparison)
        if (filters.filterDate) {
            filtered = filtered.filter(defiance => {
                const defianceDate = new Date(defiance.created_at);
                const filterSelectedDate = new Date(filters.filterDate);
    
                // Compare only the date part (ignoring time part)
                return defianceDate.getFullYear() === filterSelectedDate.getFullYear() &&
                       defianceDate.getMonth() === filterSelectedDate.getMonth() &&
                       defianceDate.getDate() === filterSelectedDate.getDate();
            });
        }
        setFilteredDefiances(filtered);
    };

    

return (
    <>
    <CoordinatorNavigation />
    <CoordinatorInfo />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Individual Uniform Defiances</h6>
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
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SFforDefianceHistory onSearch={handleSearch} onFilterChange={handleFilterChange}/> </div>
                <Button
                    onClick={() => setShowAddViolationModal(true)} 
                    title="Add Record"
                    style={{ marginRight: '10px', backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Add Violation
                        <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
                <ExportIndividualDefianceCSV student_idnumber={student_idnumber} />
            </div>

            {/* Breadcrumbs */}
            <nav style={{ width: '100%', marginBottom: '5px', marginLeft: '250px' }}>
                <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
                    <li style={{ marginRight: '5px' }}>
                        <Link to="/uniformdefiance-history" style={{ textDecoration: 'none', color: '#0D4809' }}>
                            History
                        </Link>
                    </li>
                    <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                    <li style={{ marginLeft: '5px', color: '#000' }}>Individual Uniform Defiance</li>
                </ol>
            </nav>

            {/* Table Section */}
            <IndividualUniformDefianceTable 
                defiances={defiances.filter(defiance => 
                    defiance.student_idnumber.includes(searchQuery) || 
                    defiance.nature_name.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                employees={employees}
                handleShowDetailsModal={handleShowDetailsModal}
                filteredDefiances={filteredDefiances}  
                filters={filters}  
                searchQuery={searchQuery}
            />
            </div>

            {/* Add Individual Violation Record Modal */}
            <AddUniformDefianceModal
                show={showAddViolationModal}
                onHide={handleCloseAddViolationModal} 
                handleCloseModal={handleCloseAddViolationModal} 
                studentInfo={studentInfo} 
            />

            {/* View Uniform Defiance Modal */}
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
