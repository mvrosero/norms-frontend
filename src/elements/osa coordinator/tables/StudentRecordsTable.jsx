import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js'; 
import "../../../styles/Students.css"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const StudentRecordsTable = ({filters, searchQuery}) => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false);
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


     // Pagination state
     const [currentPage, setCurrentPage] = useState(1);
     const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending


    // Fetch the students
    const fetchUsers = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/students-not-archived', { headers });

                const fuse = new Fuse(response.data, {
                    keys: ['student_idnumber', 'first_name', 'middle_name', 'last_name', 'suffix'],
                    includeScore: true,
                    threshold: 0.4, 
                });

                // Perform fuzzy search
                const searchResults = fuse.search(searchQuery);

                // Extract the item from search results
                const filteredUsers = searchResults.map(result => result.item);

                setUsers(filteredUsers);
            } else {
                response = await axios.get('http://localhost:9000/students-not-archived', { headers });
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [headers, deletionStatus]);


     // Fetch the departments
    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, [headers]);


     // Fetch the programs
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


    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) => d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find((p) => p.program_id === programId);
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
                        <option key={value} value={value}> {value} </option>))}
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


// Render student records table
const renderTable = () => {

    const activeUsers = users.filter(user => user.status !== 'archived');

        // Calculate filteredUsers first
        const filteredUsers = activeUsers.filter(user => {
            const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`.toLowerCase();
            const studentId = user.student_idnumber.toLowerCase();
            const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) || studentId.includes(searchQuery.toLowerCase());
        
            const matchesFilters = Object.keys(filters).every(key => {
                if (filters[key]) {
                    if (key === 'yearLevel' && user.year_level && user.year_level !== filters[key]) return false;  
                    if (key === 'program' && user.program_name && user.program_name !== filters[key]) return false;  
                    if (key === 'batch' && user.batch !== filters[key]) return false;
                    if (key === 'status' && user.status !== filters[key]) return false;
                }
                return true;
            });
            return matchesSearchQuery && matchesFilters; 
        });
        
        const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return ( 
        <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px', marginTop: '10px' }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}> 
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
                <th style={{ width: '10%'}}>Year Level</th>
                <th style={{ width: '18%'}}>Department</th>
                <th style={{ width: '18%'}}>Program</th>
                <th style={{ width: '12%'}}>Status</th>
            </tr>
        </thead>
        <tbody>
        {filteredUsers && filteredUsers.length > 0 ? (
            currentUsers.map((user, index) => ( 
                <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>{user.student_idnumber}</td>
                <td>
                    <a
                    href="#"
                    onClick={() => handleRedirect(user.student_idnumber)}
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
                <td>{getDepartmentName(user.department_id)}</td>
                <td>{getProgramName(user.program_id)}</td>
                <td style={{ textAlign: 'center' }}>
                    <div style={{ backgroundColor: user.status === 'active' ? '#DBF0DC' : '#F0DBDB', color: user.status === 'active' ? '#30A530' : '#D9534F', fontWeight: '600', fontSize: '14px', borderRadius: '30px', padding: '5px 20px', display: 'inline-flex', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'active' ? '#30A530' : '#D9534F', marginRight: '7px' }} />
                    {user.status}
                    </div>
                </td>
                </tr>
            ))
            ) : (
            <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No users found</td>
            </tr>
            )}

        </tbody>
    </Table>
    );
};


return (
    <>
        {renderTable()}

        {renderPagination()}
    </>
    );
}


export default StudentRecordsTable;
