import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
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
    const { department_code } = useParams(); // Get department_code from URL
    const navigate = useNavigate(); // Add useNavigate hook
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [showViolationModal, setShowViolationModal] = useState(false); // New state for violation modal

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending


    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9000/coordinator-studentrecords/${department_code}`, { headers });
            
            // Set users to an empty array if no data is returned
            if (response.data.length === 0) {
                setUsers([]);
            } else {
                setUsers(response.data);
            }
        } catch (error) {
            // Only show error alert if it's not a 404 (no users found)
            if (error.response && error.response.status === 404) {
                setUsers([]); // No users found for the department
            } else {
                console.error('Error fetching users:', error);
                Swal.fire('Error', 'Failed to fetch users.', 'error');
            }
        }
    }, [headers, department_code, deletionStatus]);
    

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

    const handleRedirect = async (student_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/student/${student_idnumber}`);
            const student = response.data;
            localStorage.setItem('selectedStudent', JSON.stringify(student)); // Store selected student data in localStorage
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
        handleRedirect(user.student_idnumber); // Use handleRedirect instead
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };

    const deleteUser = async (userId) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then(result => result.isConfirmed);

        if (!isConfirm) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:9000/student/${userId}`);
            if (response.status === 200) {
                Swal.fire('Success', 'Successfully Deleted', 'success');
                setDeletionStatus(prevStatus => !prevStatus);
                setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'An error occurred while deleting user.', 'error');
        }
    };

    const handleCreateViolation = () => {
        setShowViolationModal(true); // Show the modal for creating a violation record
    };

    const handleCloseModal = () => {
        setShowViolationModal(false); // Hide the modal
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
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
          };
    
    
          // Sort users based on idnumber
          const handleSortIdNumber = () => {
            const sortedUsers = [...users];
            sortedUsers.sort((a, b) => {
                // Parse student_idnumber as integers to ensure numeric sorting
                const idNumberA = parseInt(a.student_idnumber, 10);
                const idNumberB = parseInt(b.student_idnumber, 10);
        
                // Check if the parsed values are valid numbers
                if (isNaN(idNumberA) || isNaN(idNumberB)) {
                    return 0; // If the values are invalid, maintain the order
                }
        
                // Compare numeric values for sorting
                if (sortOrder === 'asc') {
                    return idNumberA - idNumberB; // Ascending order
                } else {
                    return idNumberB - idNumberA; // Descending order
                }
            });
            setUsers(sortedUsers);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
        };
        
    
 // Pagination
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
        width: '30px', // Fixed width for equal size
        height: '30px', // Fixed height for equal size
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #a0a0a0',
        backgroundColor: '#ebebeb',
        color: '#4a4a4a',
        fontSize: '0.75rem', // Smaller font size
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
                    style={{
                        fontSize: '14px',
                        padding: '5px 25px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                    }}
                >
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                        <option key={value} value={value}> {value} </option>
                    ))}
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
                        onClick={() =>
                            currentPage < totalPages && handlePaginationChange(currentPage + 1)
                        }
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



  // Render Table
  const renderTable = () => {
    return (
        <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
        <thead>
            <tr>
                <th style={{ width: '4%'}}>No.</th>
                <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '11%' }}>
            <button
                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', 
                }}
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
            <button
                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', 
                }}
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
                    {/* Display row count based on index */}
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{user.student_idnumber}</td>
                    <td>
                        <a
                            href="#"
                            onClick={() => handleReadModalShow(user)}
                            style={{
                            textDecoration: 'none',  // Start with no underline
                            color: 'black',
                            cursor: 'pointer',
                            transition: 'color 0.3s ease, text-decoration 0.3s ease',  // Smooth transition
                            }}
                            onMouseEnter={(e) => {
                            e.target.style.textDecoration = 'underline';  // Add underline on hover
                            e.target.style.color = '#007bff';  // Change color to indicate hover
                            }}
                            onMouseLeave={(e) => {
                            e.target.style.textDecoration = 'none';  // Remove underline when not hovering
                            e.target.style.color = 'black';  // Revert to original color
                            }}
                        >
                            {`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}
                        </a>
                        </td>
                    <td>{user.year_level}</td>
                    <td>{getProgramName(user.program_id)}</td>
                    <td style={{ textAlign: 'center' }}>
                        <div style={{
                            backgroundColor: user.status === 'active' ? '#DBF0DC' : '#F0DBDB',
                            color: user.status === 'active' ? '#30A530' : '#D9534F',
                            fontWeight: '600',
                            fontSize: '14px',
                            borderRadius: '30px',
                            padding: '5px 20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: user.status === 'active' ? '#30A530' : '#D9534F',
                                marginRight: '7px',
                            }} />
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
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}> {departmentName || department_code || 'STUDENT RECORDS'} </h6>
            </div>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '70px', padding: '0 20px' }}>
                <div style={{ flex: '1 1 70%', minWidth: '300px' }}> <SearchAndFilter /> </div>
                <button 
                    onClick={handleCreateViolation} 
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
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

            {/* Custom Pagination */}
            {renderPagination()}

  
            {/*Create Violation Modal*/}
            <Modal show={showViolationModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Violation Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DepartmentalCreateViolationModal 
                        department_code={department_code} // Pass the department_code here
                        handleCloseModal={handleCloseModal} 
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DepartmentalStudentRecordsTable;
