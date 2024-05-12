import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useNavigate } from 'react-router';
import "../administrator/Students.css";


const Students = ({ searchQuery }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [show, setShow] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        student_idnumber: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
        email: '',
        password: '',
        year_level: '',
        profile_photo_filename: '',
        department_id: '',
        program_id: '',
        role_id: ''
    });


    const user = JSON.parse(localStorage.getItem('token'));

    
    const headers = useMemo(() => {
        if (user && user.data && user.data.token) {
            return {
                accept: 'application/json',
                Authorization: user.data.token
            };
        } else {
            return {};
        }
    }, [user]);

    const fetchUsers = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:9000/students', { headers });
         
            const filteredUsers = response.data.filter(user => 
                user.student_idnumber.includes(searchQuery) || 
                user.first_name.includes(searchQuery) ||
                user.middle_name.includes(searchQuery) ||
                user.last_name.includes(searchQuery) ||
                user.suffix.includes(searchQuery)
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [headers, searchQuery]); 

    const fetchRoles = useCallback(async () => {  
        try {
            const response = await axios.get('http://localhost:9000/roles', { headers });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
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
        fetchRoles();
        fetchDepartments();
        fetchPrograms();
    }, [fetchUsers]); 

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
    const deleteUser = async (id) => {
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
            await axios.delete(`http://localhost:3001/user/${id}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) =>d.department_id === departmentId);
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
                <Table bordered hover style={{ borderRadius: '20px' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}> {/* Setting header background color */}
                            <tr>
                                <th>ID</th>
                                <th>Student ID Number</th>
                                <th>Full Name</th>
                                <th>Year Level</th> 
                                <th>Department</th>
                                <th>Program</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.user_id}</td>
                                    <td>{user.student_idnumber}</td>
                                    <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`.trim()}</td>
                                    <td>{user.year_level}</td>
                                    <td>{getDepartmentName(user.department_id)}</td>
                                    <td>{getProgramName(user.program_id)}</td>
                                    <td>{user.status}</td>
                                    <td>
                                        <div className="float-end">
                                            <Button className='btn btn-secondary btn-md ms-2' onClick={() => handleRedirect(user.student_idnumber)}>
                                                <PermIdentityIcon />
                                            </Button>
                                            <Button className='btn btn-danger btn-md ms-2' onClick={() => deleteUser(user.id)}>
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

export default Students;
