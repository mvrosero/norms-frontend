import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


import BatchStudentsToolbar from '../toolbars/BatchStudentsToolbar';
import ViewStudentModal from '../modals/ViewStudentModal';
import EditStudentModal from '../modals/EditStudentModal';
import "../../../styles/Students.css";

const StudentsTable = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  // Sorting state for full name
  const [sortOrder, setSortOrder] = useState('asc'); 


  // Fetch the users, departments, and programs
  const fetchUsers = useCallback(async () => {
    try {
      const [userResponse, departmentResponse, programResponse] = await Promise.all([
        axios.get('http://localhost:9000/students-not-archived'),
        axios.get('http://localhost:9000/departments'),
        axios.get('http://localhost:9000/programs'),
      ]);
      setUsers(userResponse.data);
      setDepartments(departmentResponse.data);
      setPrograms(programResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  // Handle selecting individual users
  const handleSelectUser = (userId) => {
    setSelectedStudentIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(userId)) {
        return prevSelectedIds.filter(id => id !== userId);
      } else {
        return [...prevSelectedIds, userId];
      }
    });
  };


  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudentIds([]);
    } else {
      const allIds = users.map(user => user.student_idnumber);
      setSelectedStudentIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleReadModalShow = (user) => {
    setSelectedUser(user);
    setShowReadModal(true);
  };

  const handleReadModalClose = () => setShowReadModal(false);

  const handleUpdateModalShow = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => setShowUpdateModal(false);



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`;
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by full name
      user.student_idnumber.toLowerCase().includes(searchQuery.toLowerCase()) // Search by ID number
    );
  });

  // Handle batch update
  const handleBatchUpdate = (updates) => {
    axios
      .put('http://localhost:9000/students', {
        student_ids: selectedStudentIds,
        updates,
      })
      .then((response) => {
        Swal.fire('Success', 'Batch update successful', 'success');
        fetchUsers(); 
        setShowUpdateModal(false); 
      })
      .catch((error) => {
        Swal.fire('Error', error.response?.data?.error || 'Failed to update students', 'error');
      });
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
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
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
            <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange}
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
                <button onClick={() =>
                    currentPage > 1 && handlePaginationChange(currentPage - 1) }
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
                    <button key={number} onClick={() => handlePaginationChange(number)} style={number === currentPage ? activeButtonStyle : buttonStyle}>
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


// Render the students table
const renderTable = () => {
  
    return (
      <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
        <thead>
          <tr>
            <th style={{ width: '3%' }}> <input type="checkbox" checked={selectAll} onChange={handleSelectAll}/> </th>
            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '11%' }}>
              <button
                  style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
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
                  style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
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
            <th style={{ width: '9%' }}>Year Level</th>
            <th>Department</th>
            <th>Program</th>
            <th style={{ width: '12%' }}>Status</th>
            <th style={{ width: '9%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.student_idnumber}>
              <td> <input type="checkbox" checked={selectedStudentIds.includes(user.student_idnumber)} onChange={() => handleSelectUser(user.student_idnumber)}/> </td>
              <td>{user.student_idnumber}</td>
              <td>{`${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`}</td>
              <td>{user.year_level}</td>
              <td>{departments.find(department => department.department_id === user.department_id)?.department_name || ''}</td>
              <td>{programs.find(program => program.program_id === user.program_id)?.program_name || ''}</td>
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
              <td>
                <div className="d-flex justify-content-around">
                  <Button className='btn btn-secondary btn-sm' onClick={() => handleReadModalShow(user)}>
                    <PersonIcon />
                  </Button>
                  <Button className='btn btn-success btn-sm' onClick={() => handleUpdateModalShow(user)}>
                    <EditIcon />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };


return (
    <div>
      {selectedStudentIds.length > 0 && (
        <BatchStudentsToolbar
          selectedItemsCount={selectedStudentIds.length}
          selectedStudentIds={selectedStudentIds}
        />
      )}

      {renderTable()}

      {renderPagination()}

      {/* View Student Modal */}
        <ViewStudentModal
            show={showReadModal}
            onHide={handleReadModalClose}
            user={selectedUser}
            departments={departments}
            programs={programs}
        />

      {/* Edit Student Modal */}
        <EditStudentModal
            show={showUpdateModal}
            onHide={handleUpdateModalClose} 
            user={selectedUser}
            fetchUsers={fetchUsers}
            departments={departments} 
            programs={programs} 
        />
    </div>
  );
};


export default StudentsTable;
