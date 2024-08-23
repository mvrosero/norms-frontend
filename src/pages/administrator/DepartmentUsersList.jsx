import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';
import axios from 'axios';

export default function DepartmentUsersList() {
    const { department_code } = useParams(); 
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null); // Added state for error handling
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        } else {
            fetchUsersByDepartment();
        }
    }, [department_code, navigate]);

    const fetchUsersByDepartment = async () => {
        try {
            // Assuming backend runs on localhost:9000
            const response = await axios.get(`http://localhost:9000/admin-usermanagement/${encodeURIComponent(department_code)}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : 'Failed to fetch users. Please try again later.');
        }
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title">USER MANAGEMENT - {department_code.toUpperCase()}</h6>
            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
                {/* Add additional controls if needed */}
            </div>
            {error && <div style={{ color: 'red', margin: '20px' }}>{error}</div>} {/* Display error message if any */}
            <table className="table table-bordered" style={{ marginTop: '20px', width: '80%', margin: 'auto' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6">No users found.</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.department_code}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
