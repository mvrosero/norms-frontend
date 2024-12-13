import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js'; // Import fuse.js
import "../../../styles/Students.css"

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const StudentRecordsTable = ({ searchQuery }) => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false); // State to track deletion status
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

    const fetchUsers = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/students-not-archived', { headers });

                // Create a new instance of Fuse with the users data and search options
                const fuse = new Fuse(response.data, {
                    keys: ['student_idnumber', 'first_name', 'middle_name', 'last_name', 'suffix'],
                    includeScore: true,
                    threshold: 0.4, // Adjust threshold as needed
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
    }, [headers, searchQuery]);

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, [headers]);

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

    const deleteUser = async (userId) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });
        if (!isConfirm) {
            return;
        }
    
        try {
            await axios.delete(`http://localhost:9000/student/${userId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            setDeletionStatus(prevStatus => !prevStatus); // Toggle deletionStatus to trigger re-fetch
            // Update the users state by removing the deleted user
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) => d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find((p) => p.program_id === programId);
        return program ? program.program_name : '';
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
    

  // Calculate paginated users
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  // Handle pagination change
  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


   // Render Table
   const renderTable = () => {
    return ( 
        <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px', marginTop: '10px' }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}> {/* Setting header background color */}
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
                <th style={{ width: '10%'}}>Year Level</th>
                <th style={{ width: '18%'}}>Department</th>
                <th style={{ width: '18%'}}>Program</th>
                <th style={{ width: '12%'}}>Status</th>
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
                            onClick={() => handleRedirect(user.student_idnumber)}
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
                    <td>{getDepartmentName(user.department_id)}</td>
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


// Render Custom Pagination
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '15px',
        }}
      >
        {/* Page Info */}
        <div style={{ fontSize: '0.875rem', color: '#4a4a4a', marginRight: '10px' }}>
          Page {currentPage} out of {totalPages}
        </div>
  
        {/* Pagination Buttons */}
        <div style={{ display: 'flex', marginRight: '20px' }}>
          <button
            onClick={() => currentPage > 1 && handlePaginationChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...buttonStyle,
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              ...(currentPage === 1 && disabledButtonStyle),
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
              ...(currentPage === totalPages && disabledButtonStyle),
            }}
          >
            ❯
          </button>
        </div>
      </div>
    );
  };


    return (
        <>
            {renderTable()}

            {/* Custom Pagination */}
            {renderPagination()}
        </>
    );
}

export default StudentRecordsTable;
