import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaPlus } from 'react-icons/fa';

import CoordinatorNavigation from '../../../pages/osa coordinator/CoordinatorNavigation';
import CoordinatorInfo from '../../../pages/osa coordinator/CoordinatorInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';
import DepartmentalCreateViolationModal from '../modals/DepartmentalCreateViolationModal';

const DepartmentalStudentRecordsTable = () => {
    const { department_code } = useParams(); 
    const navigate = useNavigate(); 
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [showViolationModal, setShowViolationModal] = useState(false); 

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); 


    // Fetch the students
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9000/coordinator-studentrecords/${department_code}`, { headers });
            
            if (response.data.length === 0) {
                setUsers([]);
            } else {
                setUsers(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setUsers([]); 
            } else {
                console.error('Error fetching users:', error);
                Swal.fire('Error', 'Failed to fetch users.', 'error');
            }
        }
    }, [headers, department_code, deletionStatus]);
    

    // Fetch the departments
    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);

            const normalizedDepartmentCode = department_code.toUpperCase();
            const department = response.data.find(d => d.department_code.toUpperCase() === normalizedDepartmentCode);
            if (department) {
                setDepartmentName(department.department_name);
            } else {
                console.log('Department not found for code:', department_code);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, [headers, department_code]);


    // Fetch the student programs
    const fetchPrograms = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/programs', { headers });
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    }, [headers]);

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
        fetchPrograms();
    }, [fetchUsers, fetchDepartments, fetchPrograms]);

    const getProgramName = (programId) => {
        const program = programs.find(p => p.program_id === programId);
        return program ? program.program_name : '';
    };


    // Handle redirect to selected student
    const handleRedirect = async (student_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/student/${student_idnumber}`);
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
    return (
        <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
        <thead>
            <tr>
                <th style={{ width: '4%'}}>No.</th>
                <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '11%' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        onClick={handleSortIdNumber}
                        >
                        <span style={{ textAlign: 'center' }}>ID Number</span>
                        {sortOrder === 'asc' ? (
                        <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                        ) : (
                        <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                        )}
                    </button>
                </th>
                <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle' }}>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        onClick={handleSortFullName}
                        >
                        <span style={{ textAlign: 'center' }}>Full Name</span>
                        {sortOrder === 'asc' ? (
                        <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                        ) : (
                        <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                        )}
                    </button>
                </th>
                <th style={{ width: '10%' }}>Year Level</th>
                <th>Program</th>
                <th style={{ width: '12%' }}>Status</th>
            </tr>
        </thead>
        <tbody>
            {currentUsers.map((user, index) => (
                <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{user.student_idnumber}</td>
                    <td>
                        <a href="#"
                            onClick={() => handleReadModalShow(user)}
                            style={{ textDecoration: 'none', color: 'black', cursor: 'pointer', transition: 'color 0.3s ease, text-decoration 0.3s ease' }}
                            onMouseEnter={(e) => {
                                e.target.style.textDecoration = 'underline';  
                                e.target.style.color = '#007bff';  
                                }}
                            onMouseLeave={(e) => {
                                e.target.style.textDecoration = 'none';  
                                e.target.style.color = 'black';  
                                }}
                        >
                            {`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}
                        </a>
                    </td>
                    <td>{user.year_level}</td>
                    <td>{getProgramName(user.program_id)}</td>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '70px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SearchAndFilter /> </div>
                <button 
                    onClick={handleCreateViolation} 
                    style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900', padding: '12px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Create Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Breadcrumbs */}
            <nav style={{ marginTop: '5px', marginBottom: '20px', marginLeft: '120px' }}>
                <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex' }}>
                    <li style={{ marginRight: '5px' }}>
                        <Link to="http://localhost:3000/coordinator-studentrecords" style={{ textDecoration: 'none', color: '#0D4809' }}>
                            Students
                        </Link>
                    </li>
                    <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                    <li style={{ marginLeft: '5px', color: '#000' }}>{departmentName}</li>
                </ol>
            </nav>

            {renderTable()}

            {renderPagination()}

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


export default DepartmentalStudentRecordsTable;
