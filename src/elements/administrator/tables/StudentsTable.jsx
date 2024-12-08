import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import BatchStudentsToolbar from '../toolbars/BatchStudentsToolbar';

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
        axios.get('http://localhost:9000/students'),
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
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowReadModal(true);
  };

  const handleCloseReadModal = () => setShowReadModal(false);

  // Handle modal to update user details
  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  // Handle batch update
  const handleBatchUpdate = (updates) => {
    axios
      .put('http://localhost:9000/students-multiupdate', {
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
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Year Level</th>
            <th>Department</th>
            <th>Program</th>
            <th>Status</th>
            <th>Actions</th>
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
              <td>{user.full_name}</td>
              <td>{user.year_level}</td>
              <td>{user.department_name}</td>
              <td>{user.program_name}</td>
              <td>{user.status}</td>
              <td>
                <Button variant="info" onClick={() => handleViewUser(user)}>
                  <PersonIcon />
                </Button>
                <Button variant="warning" onClick={() => handleUpdateUser(user)}>
                  <EditIcon />
                </Button>
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
      <Modal show={showReadModal} onHide={handleCloseReadModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <strong>Full Name:</strong> {selectedUser?.full_name}
          </div>
          <div>
            <strong>Student ID:</strong> {selectedUser?.student_idnumber}
          </div>
          <div>
            <strong>Year Level:</strong> {selectedUser?.year_level}
          </div>
          <div>
            <strong>Department:</strong> {selectedUser?.department_name}
          </div>
          <div>
            <strong>Program:</strong> {selectedUser?.program_name}
          </div>
          <div>
            <strong>Status:</strong> {selectedUser?.status}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReadModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Student Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              const updates = {
                year_level: selectedUser.year_level,
                department_id: selectedUser.department_id,
                program_id: selectedUser.program_id,
                status: selectedUser.status,
              };
              handleBatchUpdate(updates);
            }}
          >
            <Form.Group controlId="year_level">
              <Form.Label>Year Level</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser?.year_level}
                onChange={(e) => setSelectedUser({ ...selectedUser, year_level: e.target.value })}
              >
                <option>First Year</option>
                <option>Second Year</option>
                <option>Third Year</option>
                <option>Fourth Year</option>
                <option>Fifth Year</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="department_id">
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser?.department_id}
                onChange={(e) => setSelectedUser({ ...selectedUser, department_id: e.target.value })}
              >
                {departments.map(department => (
                  <option key={department.department_id} value={department.department_id}>
                    {department.department_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="program_id">
              <Form.Label>Program</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser?.program_id}
                onChange={(e) => setSelectedUser({ ...selectedUser, program_id: e.target.value })}
              >
                {programs.map(program => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser?.status}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Student
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentsTable;
