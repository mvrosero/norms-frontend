import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js'; // Import fuse.js
import "../../styles/Students.css";

const StudentRecordsTable = ({ searchQuery }) => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false); // State to track deletion status
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/students', { headers });

                // Create a new instance of Fuse with the users data and search options
                const fuse = new Fuse(response.data, {
                    keys: ['student_idnumber', 'first_name', 'middle_name', 'last_name', 'suffix'],
                    includeScore: true,
                    threshold: 0.4, // Adjust threshold as needed
                });

                // Perform fuzzy search
                const searchResults = fuse.search(searchQuery);

                // Extract the item from search results
                const filteredUsers = searchResults.map(result => result.item);

                setUsers(filteredUsers);
            } else {
                response = await axios.get('http://localhost:9000/students', { headers });
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [headers, searchQuery]);

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
    }, [fetchUsers, fetchDepartments, fetchPrograms]);

    const handleRedirect = async (student_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/student/${student_idnumber}`);
            const student = response.data;
            localStorage.setItem('selectedStudent', JSON.stringify(student)); // Store selected student data in localStorage
            navigate(`/individualstudentrecord/${student_idnumber}`);
        } catch (error) {
            console.error('Error fetching student:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while fetching student data. Please try again later.',
            });
        }
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
            setDeletionStatus(prevStatus => !prevStatus); // Toggle deletionStatus to trigger re-fetch
            // Update the users state by removing the deleted user
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) => d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find((p) => p.program_id === programId);
        return program ? program.program_name : '';
    };

    

    return (
        <>
            <div className='container'>
                <br />
                <div className='col-12'>
                </div>

                {/*student table*/}
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}> {/* Setting header background color */}
                        <tr>
                            <th style={{ width: '5%'}}>ID</th>
                            <th style={{ width: '10%'}}>ID Number</th>
                            <th>Full Name</th>
                            <th style={{ width: '10%'}}>Year Level</th>
                            <th>Department</th>
                            <th>Program</th>
                            <th style={{ width: '12%'}}>Status</th>
                            <th style={{ width: '10%'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                                <td>{user.student_idnumber}</td>
                                <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`.trim()}</td>
                                <td>{user.year_level}</td>
                                <td>{getDepartmentName(user.department_id)}</td>
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
                                        <Button className='btn btn-secondary btn-md ms-2' onClick={() => handleRedirect(user.student_idnumber)}>
                                            <PersonIcon />
                                        </Button>
                                        <Button className='btn btn-danger btn-md ms-2' onClick={() => deleteUser(user.user_id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>
        </>
    );
}

export default StudentRecordsTable;
