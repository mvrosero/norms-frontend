import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';
import "./Students.css"; // Assuming similar styles

const DepartmentUsersList = () => {
    const { department_code } = useParams();
    const [users, setUsers] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsersByDepartment = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            setHeaders({ Authorization: `Bearer ${token}` });

            const response = await axios.get(`http://localhost:9000/admin-usermanagement/${encodeURIComponent(department_code)}`, { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.response ? error.response.data.message : 'Failed to fetch users. Please try again later.');
        }
    }, [department_code, headers]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        } else {
            fetchUsersByDepartment();
        }
    }, [department_code, fetchUsersByDepartment, navigate]);

    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
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
        }).then((result) => result.isConfirmed);

        if (!isConfirm) return;

        try {
            await axios.delete(`http://localhost:9000/admin-usermanagement/${userId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };

    return (
        <>
            <AdminNavigation />
            <AdminInfo />
            <div className='container'>
                <h6 className="page-title">USER MANAGEMENT - {department_code.toUpperCase()}</h6>
                {error && <div style={{ color: 'red', margin: '20px' }}>{error}</div>}
                <Table bordered hover responsive style={{ borderRadius: '20px', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Full Name</th>
                            <th style={{ width: '10%' }}>Year Level</th>
                            <th>Program</th>
                            <th style={{ width: '12%' }}>Status</th>
                            <th style={{ width: '13%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.user_id}>
                                    <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                                    <td>{user.student_idnumber}</td>
                                    <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
                                    <td>{user.year_level}</td>
                                    <td>{user.program_id}</td>
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
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={showReadModal} onHide={handleReadModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>VIEW USER RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="row">
                            <div className="col-md-4">
                                <p><strong>ID Number:</strong></p>
                                <p><strong>Name:</strong></p>
                                <p><strong>Year Level:</strong></p>
                                <p><strong>Program:</strong></p>
                            </div>
                            <div className="col-md-8">
                                <p>{selectedUser.student_idnumber}</p>
                                <p>{`${selectedUser.first_name} ${selectedUser.middle_name} ${selectedUser.last_name} ${selectedUser.suffix}`}</p>
                                <p>{selectedUser.year_level}</p>
                                <p>{selectedUser.program_id}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showUpdateModal} onHide={handleUpdateModalClose} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title>UPDATE USER RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Include your update form or component here */}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DepartmentUsersList;
