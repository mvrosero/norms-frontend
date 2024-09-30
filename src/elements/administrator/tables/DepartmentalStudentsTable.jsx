import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const DepartmentalStudentsTable  = ({ departmentName }) => {
    const [usersByDepartment, setUsersByDepartment] = useState([]);

    const fetchUsersByDepartment = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9000/users-by-department/${departmentName}`);
            setUsersByDepartment(response.data);
        } catch (error) {
            console.error('Error fetching users by department:', error);
        }
    }, [departmentName]);

    useEffect(() => {
        fetchUsersByDepartment();
    }, [fetchUsersByDepartment, departmentName]);

    return (
        <div className='container'>
            <br />
            <Table bordered hover responsive style={{ borderRadius: '20px' }}>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {usersByDepartment.map((users, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={4} className='bg-primary text-white'>{users.department_name}</td>
                            </tr>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td></td>
                                    <td>{user.user_id}</td>
                                    <td>{`${user.first_name} ${user.middle_name} ${user.last_name}`}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default DepartmentalStudentsTable;
