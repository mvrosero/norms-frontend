import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

const ArchivesTable = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/students', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }, [headers]);

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
    }, [fetchUsers]);

    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) => d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find((p) => p.program_id === programId);
        return program ? program.program_name : '';
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
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
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
            <div className='container'>
                <br />
                <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '110px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Full Name</th>
                            <th style={{ width: '10%' }}>Year Level</th>
                            <th>Department</th>
                            <th>Program</th>
                            <th style={{ width: '10%' }}>Batch</th> {/* New Batch column */}
                            <th style={{ width: '12%' }}>Status</th>
                            <th style={{ width: '13%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                                <td>{user.student_idnumber}</td>
                                <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
                                <td>{user.year_level}</td>
                                <td>{getDepartmentName(user.department_id)}</td>
                                <td>{getProgramName(user.program_id)}</td>
                                <td>{user.batch}</td> {/* Display batch information */}
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

            <Modal show={showReadModal} onHide={handleReadModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '65px' }}>VIEW STUDENT RECORD</Modal.Title>
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
                        <div className="row">
                            <div className="col-md-4">
                                <p><strong>ID Number:</strong></p>
                                <p><strong>Name:</strong></p>
                                <p><strong>Email:</strong></p>
                                <p><strong>Year Level:</strong></p>
                                <p><strong>Department:</strong></p>
                                <p><strong>Program:<br /></strong></p>
                                <p><strong>Batch:</strong></p> {/* Display Batch field */}
                            </div>
                            <div className="col-md-8" style={{ display: 'flex', flexDirection: 'column' }}>
                                <p>{selectedUser.student_idnumber}</p>
                                <p>{selectedUser.first_name} {selectedUser.middle_name} {selectedUser.last_name} {selectedUser.suffix}</p>
                                <p>{selectedUser.email}</p>
                                <p>{selectedUser.year_level}</p>
                                <p>{getDepartmentName(selectedUser.department_id)}</p>
                                <p>{getProgramName(selectedUser.program_id)}</p>
                                <p>{selectedUser.batch}</p> {/* Show batch information in modal */}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ArchivesTable;
