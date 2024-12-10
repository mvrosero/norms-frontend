import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

// Assuming EmployeeUpdate component is defined in './EmployeeUpdate.js'
import EditEmployeeModal from '../modals/EditEmployeeModal';
import ViewEmployeeModal from '../modals/ViewEmployeeModal';
import BatchEmployeesToolbar from '../toolbars/BatchEmployeesToolbar';
import "../../../styles/Employees.css";

const EmployeesTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);  
    const [selectAll, setSelectAll] = useState(false);  

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/employees', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
        }
    }, [headers, deletionStatus]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/roles', { headers });
            setRoles(response.data);
            console.log('Fetched roles:', response.data); // Add this line to check the roles
        } catch (error) {
            console.error('Error fetching roles:', error.response ? error.response.data : error.message);
        }
    }, [headers]);
    

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };

    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.role_id === roleId);
        console.log('Role ID:', roleId, 'Role Name:', role ? role.role_name : 'Not Found'); // Add this line for debugging
        return role ? role.role_name : 'Unknown Role';
    };

    const handleUpdateModalShow = (user) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    const handleUpdateModalClose = () => {
        setShowUpdateModal(false);
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
            await axios.delete(`http://localhost:9000/employee/${userId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            setDeletionStatus(prevStatus => !prevStatus);
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };


  // Handle selecting individual users
  const handleSelectUser = (userId) => {
    setSelectedEmployeeIds((prevSelectedIds) => {
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
          setSelectedEmployeeIds([]);
        } else {
          const allIds = users.map(user => user.student_idnumber);
          setSelectedEmployeeIds(allIds);
        }
        setSelectAll(!selectAll);
      };

    const handleBatchDelete = async () => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete them!'
        }).then((result) => result.isConfirmed);

        if (!isConfirm) return;

        try {
            await axios.delete('http://localhost:9000/employees', {
                data: { employee_ids: selectedUser },
                headers
            });
            Swal.fire({
                icon: 'success',
                text: 'Successfully deleted selected employees.'
            });
            setDeletionStatus(prevStatus => !prevStatus);
            setSelectedUser([]);  // Clear the selection after deletion
        } catch (error) {
            console.error('Error deleting employees:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                text: 'Failed to delete selected employees. Please try again.'
            });
        }
    };

      // Handle batch update
  const handleBatchUpdate = (updates) => {
    axios
      .put('http://localhost:9000/employees', {
        employee_ids: selectedEmployeeIds,
        updates,
      })
      .then((response) => {
        Swal.fire('Success', 'Batch update successful', 'success');
        fetchUsers(); // Re-fetch users after a successful update
        setShowUpdateModal(false); // Close the update modal
      })
      .catch((error) => {
        Swal.fire('Error', error.response?.data?.error || 'Failed to update employees', 'error');
      });
  };

    return (
        <>
            <div className='container'>
                <br />
                {selectedEmployeeIds.length > 0 && (
                    <BatchEmployeesToolbar
                    selectedItemsCount={selectedEmployeeIds.length}
                    selectedEmployeeIds={selectedEmployeeIds}
                        onDelete={handleBatchDelete}
                    />
                )}
                <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '110px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Full Name</th>
                            <th style={{ width: '15%' }}>Role</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '15%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                                <tr key={user.employee_idnumber}>
                                <td>
                                    <input
                                    type="checkbox"
                                    checked={selectedEmployeeIds.includes(user.employee_idnumber)}
                                    onChange={() => handleSelectUser(user.employee_idnumber)}
                                    />
                                </td>
                                <td>{user.employee_idnumber}</td>
                                <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
                                <td>{getRoleName(user.role_id)}</td>
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
                                        <Button className='btn btn-danger btn-sm' onClick={() => deleteUser(user.user_id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Read Modal */}
            <Modal show={showReadModal} onHide={handleReadModalClose} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '180px' }}>VIEW EMPLOYEE RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <ViewEmployeeModal
                            user={selectedUser}
                            handleClose={handleReadModalClose}
                            roles={roles}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={handleUpdateModalClose} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '180px' }}>UPDATE EMPLOYEE RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEmployeeModal
                        user={selectedUser}
                        handleClose={handleUpdateModalClose}
                        fetchUsers={fetchUsers}
                        headers={headers}
                        roles={roles}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default EmployeesTable;
