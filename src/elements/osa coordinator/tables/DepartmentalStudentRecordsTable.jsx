import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { FaPlus } from 'react-icons/fa';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import CoordinatorNavigation from '../../../pages/osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../../../pages/osa coordinator/CoordinatorInfo';
import SFforDepartmentalTable from '../../general/searchandfilters/SFforDepartmentalTable';
import DepartmentalCreateViolationModal from '../modals/DepartmentalCreateViolationModal';

export default function DepartmentalStudentRecordsTable() {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [showViolationModal, setShowViolationModal] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);  
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const [filters, setFilters] = useState({
      yearLevel: '',
      program: '',
      batch: '',
      status: '',
    });
    const { department_code } = useParams();
    const navigate = useNavigate();

 
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); 


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    // Fetch users from the department
    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get(
                `https://test-backend-api-2.onrender.com/coordinator-studentrecords/${department_code}`,
                { headers }
            );
            const activeUsers = response.data.filter(user => user.status !== 'archived');
            setUsers(activeUsers);  
            setAllUsers(activeUsers);  
            setFilteredUsers(activeUsers);  
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users.');
        }
    }, [department_code]);

    
    // Handle search and filter logic
    useEffect(() => {
    const filtered = users.filter(user => {
        const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`.toLowerCase();
        const studentId = user.student_idnumber.toLowerCase();
        const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) || studentId.includes(searchQuery.toLowerCase());

            const matchesFilters = Object.keys(filters).every(key => {
                if (filters[key]) {
                    if (key === 'yearLevel' && user.year_level !== filters[key]) return false;
                    if (key === 'program' && user.program_name !== filters[key]) return false;
                    if (key === 'batch' && user.batch !== filters[key]) return false;
                    if (key === 'status' && user.status !== filters[key]) return false;
                }
                return true;
            });

            return matchesSearchQuery && matchesFilters;
        });
        setFilteredUsers(filtered);
    }, [users, searchQuery, filters]);


    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
        const normalizedQuery = query ? query.toLowerCase() : '';
    
        const filtered = allUsers.filter(user => {
            const userName = user.name ? user.name.toLowerCase() : ''; 
            return userName.includes(normalizedQuery);
        });
    
        setFilteredUsers(filtered);  
    };


    // Handle filter changes (yearLevel, program, batch, status)
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);  
    
        let filtered = allUsers;
    
        // Apply filters one by one
        if (filters.yearLevel) {
            filtered = filtered.filter(user => user.yearLevel === filters.yearLevel);
        }
    
        if (filters.program) {
                filtered = filtered.filter(user => user.program === filters.program);
            }

        if (filters.batch) {
            filtered = filtered.filter(user => user.batch === filters.batch);
        }
    
        if (filters.status) {
            filtered = filtered.filter(user => user.status === filters.status);
        }
        setFilteredUsers(filtered);
    };


    // Fetch departments 
    const fetchDepartments = useCallback(async () => {
        setLoading(true); 
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get('https://test-backend-api-2.onrender.com/departments', { headers });
            setDepartments(response.data);

            const normalizedDepartmentCode = department_code?.toUpperCase();
            const department = response.data.find(d => d.department_code.toUpperCase() === normalizedDepartmentCode);
            setDepartmentName(department ? department.department_name : 'Unknown Department');
        } catch (error) {
            console.error('Error fetching departments:', error);
            setError('Failed to fetch departments.'); 
        } finally {
            setLoading(false); 
        }
    }, [department_code]);
    useEffect(() => {
        fetchDepartments();
        fetchUsers();
    }, [fetchDepartments, fetchUsers]);


    // Handle redirect to selected student
    const handleRedirect = async (student_idnumber) => {
        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/student/${student_idnumber}`);
            const student = response.data;
            localStorage.setItem('selectedStudent', JSON.stringify(student)); 
            navigate(`/individualstudentrecord/${student_idnumber}`);
        } catch (error) {
            console.error('Error fetching student:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while fetching student data. Please try again later.',
            });
        }
    };


    const handleReadModalShow = (user) => {
        handleRedirect(user.student_idnumber); 
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };
    
    const handleCreateViolation = () => {
        setShowViolationModal(true); 
    };

    const handleCloseModal = () => {
        setShowViolationModal(false); 
    };


    // Sort users based on full name
    const handleSortFullName = () => {
        const sortedUsers = [...users];
        sortedUsers.sort((a, b) => {
            const fullNameA = `${a.first_name} ${a.middle_name || ''} ${a.last_name} ${a.suffix || ''}`.toLowerCase();
            const fullNameB = `${b.first_name} ${b.middle_name || ''} ${b.last_name} ${b.suffix || ''}`.toLowerCase();
    
            if (sortOrder === 'asc') {
            return fullNameA.localeCompare(fullNameB);
            } else {
            return fullNameB.localeCompare(fullNameA);
            }
        });
        setUsers(sortedUsers);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
        };

    // Sort users based on idnumber
    const handleSortIdNumber = () => {
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
        const idNumberA = parseInt(a.student_idnumber, 10);
        const idNumberB = parseInt(b.student_idnumber, 10);

        if (isNaN(idNumberA) || isNaN(idNumberB)) {
            return 0; 
        }

        if (sortOrder === 'asc') {
            return idNumberA - idNumberB; 
        } else {
            return idNumberB - idNumberA; 
        }
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
    };
        
    
    // Pagination logic
    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / rowsPerPage);

    const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
    };


    const renderPagination = () => {
        if (loading) return null;

        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

        const buttonStyle = {
            width: '30px', 
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #a0a0a0',
            backgroundColor: '#ebebeb',
            color: '#4a4a4a',
            fontSize: '0.75rem', 
            cursor: 'pointer',
        };

        const activeButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#a0a0a0',
            color: '#f1f1f1',
        };

        const disabledButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#ebebeb',
            color: '#a1a1a1',
            cursor: 'not-allowed',
        };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: '#4a4a4a'}}>
            {/* Results per Page */}
            <div>
                <label htmlFor="rowsPerPage" style={{ marginLeft: '120px', marginRight: '5px' }}>Results per page:</label>
                <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    style={{ fontSize: '14px', padding: '5px 25px', border: '1px solid #ccc', borderRadius: '3px' }}>
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                        <option key={value} value={value}> {value} </option> ))}
                </select>
            </div>
    
            {/* Pagination Info and Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
                {/* Page Info */}
                <div style={{ marginRight: '10px' }}>Page {currentPage} of {totalPages}</div>
    
                {/* Pagination Buttons */}
                <div style={{ display: 'flex' }}>
                    <button
                        onClick={() =>
                            currentPage > 1 && handlePaginationChange(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        style={{
                            ...buttonStyle,
                            borderTopLeftRadius: '10px',
                            borderBottomLeftRadius: '10px',
                            ...(currentPage === 1 ? disabledButtonStyle : {}),
                        }}
                    >
                        ❮
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePaginationChange(number)}
                            style={number === currentPage ? activeButtonStyle : buttonStyle}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => currentPage < totalPages && handlePaginationChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            ...buttonStyle,
                            borderTopRightRadius: '10px',
                            borderBottomRightRadius: '10px',
                            ...(currentPage === totalPages ? disabledButtonStyle : {}),
                        }}
                    >
                        ❯
                    </button>
                </div>
            </div>
        </div>
    );
};


// Render the student records table
const renderTable = () => {
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ width: '50px', height: '50px', border: '6px solid #f3f3f3', borderTop: '6px solid #a9a9a9', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style> {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`} </style>
            </div>
        );
    }

        // If no users found after filtering
        if (filteredUsers.length === 0) {
            return <div style={{ textAlign: 'center' }}>No users found</div>;
        }

        return (
            <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>No.</th>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '11%' }}>
                            <button
                                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                onClick={handleSortIdNumber}
                            >
                                <span style={{ textAlign: 'center' }}>ID Number</span>
                                {sortOrder === 'asc' ? <ArrowDropUpIcon style={{ marginLeft: '5px' }} /> : <ArrowDropDownIcon style={{ marginLeft: '5px' }} />}
                            </button>
                        </th>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle' }}>
                            <button
                                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                onClick={handleSortFullName}
                            >
                                <span style={{ textAlign: 'center' }}>Full Name</span>
                                {sortOrder === 'asc' ? <ArrowDropUpIcon style={{ marginLeft: '5px' }} /> : <ArrowDropDownIcon style={{ marginLeft: '5px' }} />}
                            </button>
                        </th>
                        <th style={{ width: '10%' }}>Year Level</th>
                        <th>Program</th>
                        <th style={{ width: '12%' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{user.student_idnumber}</td>
                            <td>
                                <a href="#" onClick={() => handleReadModalShow(user)} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                                    {`${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`}
                                </a>
                            </td>
                            <td>{user.year_level}</td>
                            <td>{user.program_name}</td>
                            <td style={{ textAlign: 'center' }}>
                                <div style={{ backgroundColor: user.status === 'active' ? '#DBF0DC' : '#F0DBDB', color: user.status === 'active' ? '#30A530' : '#D9534F', fontWeight: '600', fontSize: '14px', borderRadius: '30px', padding: '5px 20px', display: 'inline-flex', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'active' ? '#30A530' : '#D9534F', marginRight: '7px' }} />
                                    {user.status}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };


return (
    <>
        <CoordinatorNavigation />
        <CoordinatorInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}> {departmentName || department_code || 'STUDENT RECORDS'} </h6>
            </div>

            {/* Search And Filter Section */}
            <div style={{  marginTop: '10px', marginLeft: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '920px' }}> <SFforDepartmentalTable onSearch={handleSearch} onFilterChange={handleFilterChange}/> </div>
                <button 
                    onClick={handleCreateViolation} 
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 30px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Create Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Breadcrumbs */}
            <nav style={{ marginTop: '5px', marginBottom: '20px', marginLeft: '120px' }}>
                <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex' }}>
                    <li style={{ marginRight: '5px' }}>
                        <Link to="/coordinator-studentrecords" style={{ textDecoration: 'none', color: '#0D4809' }}>
                            Students
                        </Link>
                    </li>
                    <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                    <li style={{ marginLeft: '5px', color: '#000' }}>{departmentName}</li>
                </ol>
            </nav>

            {renderTable()}

            {!loading && renderPagination()}

            {/*Create Violation Modal*/}
            <DepartmentalCreateViolationModal
                show={showViolationModal} 
                onHide={handleCloseModal} 
                department_code={department_code} 
                handleCloseModal={handleCloseModal}
            />
        </>
    );
};


