import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import BatchProcessToolbar from '../toolbars/BatchProcessToolbar'; // Import the BatchProcessToolbar component

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
    const [selectedUsers, setSelectedUsers] = useState(new Set()); // New state to track selected users
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [selectAll, setSelectAll] = useState(false); // New state for "Select All" checkbox

    const fetchUsers = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:9000/students', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }, [headers, deletionStatus]);

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

    const handleCheckboxChange = (userId) => {
        const updatedSelection = new Set(selectedUsers);
        if (updatedSelection.has(userId)) {
            updatedSelection.delete(userId);
        } else {
            updatedSelection.add(userId);
        }
        setSelectedUsers(updatedSelection);
    };

    const handleSelectAllChange = () => {
        const newSelectedUsers = selectAll ? new Set() : new Set(users.map(user => user.user_id));
        setSelectedUsers(newSelectedUsers);
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = () => {
        selectedUsers.forEach(userId => deleteUser(userId));
        setSelectedUsers(new Set()); // Clear selection after deletion
        setSelectAll(false); // Reset "Select All" checkbox
    };

    const handleEditSelected = () => {
        // Implement your batch edit logic here
        console.log("Edit selected users: ", Array.from(selectedUsers));
    };

    return (
        <>
            <div className='container'>
                <br />
                {selectedUsers.size > 0 && ( // Show BatchProcessToolbar if there are selected users
                    <BatchProcessToolbar
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
                            </th> {/* Checkbox column */}
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
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.has(user.user_id)} 
                                        onChange={() => handleCheckboxChange(user.user_id)} 
                                    />
                                </td>
                                <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                                <td>{user.student_idnumber}</td>
                                <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
                                <td>{user.year_level}</td>
                                <td>{departments.find(department => department.department_id === user.department_id)?.department_name || ''}</td>
                                <td>{programs.find(program => program.program_id === user.program_id)?.program_name || ''}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{
                                        backgroundColor: user.status === 'active' ? '#DBF0DC' : '#F0DBF0',
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
                            right: '15px',
                            top: '10px',
                        }}
                    >
                        &times;
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <ViewStudentModal user={selectedUser} />
                </Modal.Body>
            </Modal>

            <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '65px' }}>EDIT STUDENT RECORD</Modal.Title>
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
                            right: '15px',
                            top: '10px',
                        }}
                    >
                        &times;
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <EditStudentModal user={selectedUser} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default StudentsTable;
