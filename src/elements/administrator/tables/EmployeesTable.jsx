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
import "../../../styles/Employees.css";

const EmployeesTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});
    const [deletionStatus, setDeletionStatus] = useState(false);

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
        } catch (error) {
            console.error('Error fetching roles:', error.response ? error.response.data : error.message);
        }
    }, [headers]); 

    useEffect(() => {
        fetchUsers();
        fetchRoles();
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
        return role ? role.role_name : '';
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

    return (
        <>
            <div className='container'>
                <br />
                <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '110px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Full Name</th>
                            <th style={{ width: '15%' }}>Role</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '15%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td style={{ textAlign: 'center' }}>{user.user_id}</td>
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
                    <button
                        type="button"
                        className="close"
                        onClick={handleReadModalClose}
                        style={{
                            color: '#6c757d',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '30px',
                            position: 'absolute',
                            top: '2px',
                            right: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        &times;
                    </button>
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
                    <button
                        type="button"
                        className="close"
                        onClick={handleUpdateModalClose}
                        style={{
                            color: '#6c757d',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '30px',
                            position: 'absolute',
                            top: '2px',
                            right: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        &times;
                    </button>
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

