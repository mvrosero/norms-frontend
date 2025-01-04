import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Combined imports
import { FaPlus } from 'react-icons/fa';

import AdminNavigation from "../../pages/administrator/AdminNavigation";
import AdminInfo from "../../pages/administrator/AdminInfo";
import SFforDepartmentalTable from '../../elements/administrator/searchandfilters/SFforDepartmentalTable';
import ImportDepartmentalCSV from '../../elements/general/imports/ImportDepartmentalCSV';
import DepartmentalStudentsTable from '../../elements/administrator/tables/DepartmentalStudentsTable';

export default function AdminDepartmentalStudents() {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [users, setUsers] = useState([]); // Users state for fetched data
    const { department_code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Authorization check
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get(
                `http://localhost:9000/admin-usermanagement/${department_code}`,
                { headers }
            );
            const activeUsers = response.data.filter(user => user.status !== 'archived');
            setUsers(activeUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users.');
        }
    }, [department_code]);

    const fetchDepartments = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get('http://localhost:9000/departments', { headers });
            setDepartments(response.data);

            const normalizedDepartmentCode = department_code?.toUpperCase();
            const department = response.data.find(d => d.department_code.toUpperCase() === normalizedDepartmentCode);
            setDepartmentName(department ? department.department_name : 'Unknown Department');
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, [department_code]);

    useEffect(() => {
        fetchDepartments();
        fetchUsers();
    }, [fetchDepartments, fetchUsers]);

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="settings-title" style={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    color: '#242424', 
                    fontSize: '40px', 
                    fontWeight: 'bold', 
                    marginTop: '20px',
                    marginLeft: '50px' 
                }}>
                    {departmentName || department_code || 'USER MANAGEMENT'}
                </h6>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginLeft: '50px', padding: '0 20px', gap: '2px'}}>
            {/* SearchAndFilter Section */}
            <div style={{ flex: '1 1 70%', minWidth: '300px'}}><SFforDepartmentalTable /></div>

                <button
                    onClick={() => window.location.href = "http://localhost:3000/register-student"}
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        marginLeft: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Add Student
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
                <ImportDepartmentalCSV />
            </div>

            {/* Breadcrumbs */}
            <nav style={{ marginTop: '5px', marginBottom: '20px', marginLeft: '120px' }}>
                <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex' }}>
                    <li style={{ marginRight: '5px' }}>
                        <Link to="/admin-usermanagement" style={{ textDecoration: 'none', color: '#0D4809' }}>
                            Students
                        </Link>
                    </li>
                    <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                    <li style={{ marginLeft: '5px', color: '#000' }}>{departmentName || department_code}</li>
                </ol>
            </nav>

            <DepartmentalStudentsTable />
        </div>
    );
}
