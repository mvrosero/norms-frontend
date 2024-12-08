import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
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

  // Render Table
  const renderTable = () => {
    return (
      <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '110px' }}>
        <thead>
          <tr>
            <th style={{ width: '3%' }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th style={{ width: '10%' }}>ID Number</th>
            <th>Full Name</th>
            <th style={{ width: '10%' }}>Year Level</th>
            <th>Department</th>
            <th>Program</th>
            <th style={{ width: '12%' }}>Status</th>
            <th style={{ width: '11%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
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

  return (
    <div>
      <BatchStudentsToolbar
        selectedItemsCount={selectedStudentIds.length}
        selectedStudentIds={selectedStudentIds}
      />

      {renderTable()}

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
