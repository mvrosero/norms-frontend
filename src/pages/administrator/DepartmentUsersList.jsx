import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
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
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});
    const [error, setError] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
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
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        } else {
            fetchUsersByDepartment();
            fetchDepartments();
            fetchPrograms();
        }
    }, [department_code, fetchUsersByDepartment, fetchDepartments, fetchPrograms, navigate]);

    const handleReadModalShow = (user) => {
        setSelectedUser(user);
        setShowReadModal(true);
    };

    const handleReadModalClose = () => {
        setShowReadModal(false);
    };

    const handleUpdateModalShow = (user) => {
        setUpdateFormData({ ...user }); // Initialize form data with selected user data
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    const handleUpdateModalClose = () => {
        setShowUpdateModal(false);
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
        console.log('Attempting to delete user with ID:', userId);
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
            await axios.delete(`http://localhost:9000/student/${userId}`, { headers });
            console.log('User successfully deleted');
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            fetchUsersByDepartment();
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting user. Please try again later.',
            });
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting update for user:', updateFormData);
        try {
            await axios.put(`http://localhost:9000/student/${selectedUser.user_id}`, updateFormData, { headers });
            console.log('User successfully updated');
            Swal.fire({
                icon: 'success',
                text: "Successfully Updated"
            });
            fetchUsersByDepartment();
            handleUpdateModalClose();
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while updating user. Please try again later.',
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <>
            <AdminNavigation />
            <AdminInfo />
            <div className='container'>
                <h6 className="page-title">USER MANAGEMENT - {department_code.toUpperCase()}</h6>
                {error && <div style={{ color: 'red', margin: '20px' }}>{error}</div>}
                <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '110px' }}>
                    <thead>
                        <tr>
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
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.user_id}>
                                    <td style={{ textAlign: 'center' }}>{user.user_id}</td>
                                    <td>{user.student_idnumber}</td>
                                    <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
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

            {/* Read Modal */}
            <Modal show={showReadModal} onHide={handleReadModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '65px' }}>VIEW USER RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="row">
                            <div className="col-md-4">
                                <p><strong>ID Number:</strong></p>
                                <p><strong>Name:</strong></p>
                                <p><strong>Year Level:</strong></p>
                                <p><strong>Department:</strong></p>
                                <p><strong>Program:</strong></p>
                                <p><strong>Status:</strong></p>
                            </div>
                            <div className="col-md-8">
                                <p>{selectedUser.student_idnumber}</p>
                                <p>{`${selectedUser.first_name} ${selectedUser.middle_name} ${selectedUser.last_name} ${selectedUser.suffix}`}</p>
                                <p>{selectedUser.year_level}</p>
                                <p>{getDepartmentName(selectedUser.department_id)}</p>
                                <p>{getProgramName(selectedUser.program_id)}</p>
                                <p>{selectedUser.status}</p>
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

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '65px' }}>UPDATE USER RECORD</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group controlId="student_idnumber">
                                <Form.Label>ID Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="student_idnumber"
                                    value={updateFormData.student_idnumber || ''}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="first_name">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    value={updateFormData.first_name || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="middle_name">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="middle_name"
                                    value={updateFormData.middle_name || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="last_name">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    value={updateFormData.last_name || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="suffix">
                                <Form.Label>Suffix</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="suffix"
                                    value={updateFormData.suffix || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="year_level">
                                <Form.Label>Year Level</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="year_level"
                                    value={updateFormData.year_level || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="department_id">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="department_id"
                                    value={updateFormData.department_id || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((department) => (
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
                                    name="program_id"
                                    value={updateFormData.program_id || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Program</option>
                                    {programs.map((program) => (
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
                                    name="status"
                                    value={updateFormData.status || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUpdateModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DepartmentUsersList;
