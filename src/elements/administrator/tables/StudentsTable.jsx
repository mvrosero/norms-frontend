import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch users, departments, and programs
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

  // Handle modal to view user details
  const handleReadModalShow = (user) => {
    setSelectedUser(user);
    setShowReadModal(true);
  };

  const handleReadModalClose = () => setShowReadModal(false);

  // Handle modal to edit user details
  const handleUpdateModalShow = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => setShowUpdateModal(false);

  // Handle batch update
  const handleBatchUpdate = (updates) => {
    axios
      .put('http://localhost:9000/students', {
        student_ids: selectedStudentIds,
        updates,
      })
      .then((response) => {
        Swal.fire('Success', 'Batch update successful', 'success');
        fetchUsers(); // Re-fetch users after a successful update
        setShowUpdateModal(false); // Close the update modal
      })
      .catch((error) => {
        Swal.fire('Error', error.response?.data?.error || 'Failed to update students', 'error');
      });
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
      <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
        <thead>
          <tr>
            <th style={{ width: '3%' }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th style={{ width: '9%' }}>ID Number</th>
            <th>Full Name</th>
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
              <td>
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(user.student_idnumber)}
                  onChange={() => handleSelectUser(user.student_idnumber)}
                />
              </td>
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
    <div>
      {selectedStudentIds.length > 0 && (
        <BatchStudentsToolbar
          selectedItemsCount={selectedStudentIds.length}
          selectedStudentIds={selectedStudentIds}
        />
      )}

      {renderTable()}

      {/* Custom Pagination */}
      {renderPagination()}

      {/* View Student Modal */}
      <Modal show={showReadModal} onHide={handleReadModalClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ marginLeft: '65px' }}>VIEW STUDENT RECORD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && <ViewStudentModal user={selectedUser} departments={departments} programs={programs} />}
        </Modal.Body>
      </Modal>

      {/* Edit Student Modal */}
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ marginLeft: '65px' }}>EDIT STUDENT RECORD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && <EditStudentModal fetchUsers={fetchUsers} user={selectedUser} departments={departments} programs={programs} handleClose={handleUpdateModalClose} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentsTable;
