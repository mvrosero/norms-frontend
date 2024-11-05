
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import BatchStudentsToolbar from '../toolbars/BatchStudentsToolbar';

// Import the ViewStudentModal and EditStudentModal components
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
    const [headers, setHeaders] = useState({});
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/students', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            Swal.fire('Error', 'Failed to fetch students.', 'error');
        }
    }, [headers]);

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            Swal.fire('Error', 'Failed to fetch departments.', 'error');
        }
    }, [headers]);

    const fetchPrograms = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/programs', { headers });
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
            Swal.fire('Error', 'Failed to fetch programs.', 'error');
        }
    }, [headers]);

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
        fetchPrograms();
    }, [fetchUsers, fetchDepartments, fetchPrograms]);

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

    // Updated deleteUser function to handle an array of user IDs
    const deleteUsers = async (userIds) => {
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

        const promises = userIds.map(async (userId) => {
            try {
                await axios.delete(`http://localhost:9000/student/${userId}`, { headers });
                return userId; // Return the deleted user ID for filtering
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error', 'An error occurred while deleting user. Please try again later.', 'error');
                return null; // Return null if an error occurred
            }
        });

        const deletedUserIds = await Promise.all(promises);
        setUsers(prevUsers => prevUsers.filter(user => !deletedUserIds.includes(user.user_id)));
        Swal.fire('Deleted!', 'Successfully Deleted.', 'success');
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers((prev) => {
            const updatedSelection = new Set(prev);
            updatedSelection.has(userId) ? updatedSelection.delete(userId) : updatedSelection.add(userId);
            return updatedSelection;
        });
    };
    

    const handleSelectAllChange = () => {
        const newSelectedUsers = selectAll ? new Set() : new Set(users.map(user => user.user_id));
        setSelectedUsers(newSelectedUsers);
        setSelectAll(prev => !prev);
    };

    const handleDeleteSelected = async () => {
        await deleteUsers(Array.from(selectedUsers)); // Pass the array of selected user IDs
        setSelectedUsers(new Set()); // Clear selection after deletion
        setSelectAll(false); // Reset "Select All" checkbox
    };

    const handleEditSelected = () => {
        console.log("Edit selected users: ", Array.from(selectedUsers));
    };

    return (
        <>
            <div className='container'>
                <br />
                {selectedUsers.size > 0 && (
                    <BatchStudentsToolbar
                        selectedItemsCount={selectedUsers.size}
                        onEdit={handleEditSelected}
                        onDelete={handleDeleteSelected}
                    />
                )}
                <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '110px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Full Name</th>
                            <th style={{ width: '10%' }}>Year Level</th>
                            <th>Department</th>
                            <th>Program</th>
                            <th style={{ width: '12%' }}>Status</th>
                            <th style={{ width: '13%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td style={{ textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.has(user.user_id)}
                                        onChange={() => handleCheckboxChange(user.user_id)}
                                    />
                                </td>
                                <td style={{ textAlign: 'center' }}>{user.user_id}</td>
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
                                        <Button className='btn btn-danger btn-sm' onClick={() => deleteUsers([user.user_id])}>
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
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && <ViewStudentModal user={selectedUser} departments={departments} programs={programs} />}
                </Modal.Body>
            </Modal>

            <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '65px' }}>EDIT STUDENT RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && <EditStudentModal fetchUsers={fetchUsers} user={selectedUser} departments={departments} programs={programs} handleClose={handleUpdateModalClose} />}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default StudentsTable;
