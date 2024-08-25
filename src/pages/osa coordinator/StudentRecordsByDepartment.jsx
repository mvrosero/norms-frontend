import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { FaPlus } from 'react-icons/fa';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import CreateViolationRecordForm from './CreateViolationRecord';

const StudentRecordsByDepartment = () => {
    const { department_code } = useParams(); // Get department_code from URL
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [showViolationModal, setShowViolationModal] = useState(false); // New state for violation modal

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9000/coordinator-studentrecords/${department_code}`, { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to fetch users.', 'error');
        }
    }, [headers, department_code, deletionStatus]);

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);

            const normalizedDepartmentCode = department_code.toUpperCase();
            const department = response.data.find(d => d.department_code.toUpperCase() === normalizedDepartmentCode);
            if (department) {
                setDepartmentName(department.department_name);
            } else {
                console.log('Department not found for code:', department_code);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, [headers, department_code]);

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

    const getProgramName = (programId) => {
        const program = programs.find(p => p.program_id === programId);
        return program ? program.program_name : '';
    };

    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
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
        }).then(result => result.isConfirmed);

        if (!isConfirm) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:9000/student/${userId}`);
            if (response.status === 200) {
                Swal.fire('Success', 'Successfully Deleted', 'success');
                setDeletionStatus(prevStatus => !prevStatus);
                setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'An error occurred while deleting user.', 'error');
        }
    };

    const handleCreateViolation = () => {
        setShowViolationModal(true); // Show the modal for creating a violation record
    };

    const handleCloseModal = () => {
        setShowViolationModal(false); // Hide the modal
    };
    
    
    return (
        <>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">{departmentName || department_code || 'STUDENT RECORDS'}</h6>
            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
                <div style={{ width: '900px', marginLeft: '20px' }}>
                    <SearchAndFilter />
                </div>
                <button 
                    onClick={handleCreateViolation} 
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Create Violation
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            <div className="container">
                <br />
                <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px' }}>
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
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                                <td>{user.student_idnumber}</td>
                                <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
                                <td>{user.year_level}</td>
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

            {/* Read Modal */}
            <Modal show={showReadModal} onHide={handleReadModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>VIEW STUDENT RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="row">
                            <div className="col-md-4">
                                <p><strong>ID Number:</strong></p>
                                <p><strong>Name:</strong></p>
                                <p><strong>Email:</strong></p>
                                <p><strong>Year Level:</strong></p>
                                <p><strong>Program:</strong></p>
                            </div>
                            <div className="col-md-8">
                                <p>{selectedUser.student_idnumber}</p>
                                <p>{`${selectedUser.first_name} ${selectedUser.middle_name} ${selectedUser.last_name} ${selectedUser.suffix}`}</p>
                                <p>{selectedUser.email}</p>
                                <p>{selectedUser.year_level}</p>
                                <p>{getProgramName(selectedUser.program_id)}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReadModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Violation Modal */}
            <Modal show={showViolationModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Violation Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateViolationRecordForm onClose={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default StudentRecordsByDepartment;
