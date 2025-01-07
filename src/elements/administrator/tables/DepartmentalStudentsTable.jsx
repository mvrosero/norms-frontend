import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import BatchDepartmentalToolbar from '../toolbars/BatchDepartmentalToolbar';
import ViewStudentModal from '../modals/ViewStudentModal';
import EditStudentModal from '../modals/EditStudentModal';
import "../../../styles/Students.css";

const DepartmentalStudentsTable = () => {
    const { department_code } = useParams(); 
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [headers, setHeaders] = useState({});
    const [deletionStatus, setDeletionStatus] = useState(false); 
    

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for full name
    const [sortOrder, setSortOrder] = useState('asc'); 


    // Fetch the students
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9000/admin-usermanagement/${department_code}`, { headers });
            console.log('Fetched users:', response.data);
    
            const activeUsers = response.data.filter(user => user.status !== 'archived');
            setUsers(activeUsers); 
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to fetch users.', 'error');
        }
    }, [headers, department_code, deletionStatus]);
    

    // Fetch the departments
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
    
       
    // Fetch the programs
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


    // Handle selecting individual users
    const handleSelectUser = (userId) => {
        setSelectedStudentIds((prevSelectedIds) => {
        if (prevSelectedIds.includes(userId)) {
            return prevSelectedIds.filter(id => id !== userId);
        } else {
            return [...prevSelectedIds, userId];
        }
        });
    };

    // Handle "Select All" checkbox
    const handleSelectAll = () => {
        if (selectAll) {
        setSelectedStudentIds([]);
        } else {
        const allIds = users.map(user => user.student_idnumber);
        setSelectedStudentIds(allIds);
        }
        setSelectAll(!selectAll);
    };
    
    // Handle batch update
    const handleBatchUpdate = (updates) => {
        axios
        .put('http://localhost:9000/students', {
            student_ids: selectedStudentIds,
            updates,
        })
        .then((response) => {
            Swal.fire('Success', 'Batch update successful', 'success');
            fetchUsers(); 
            setShowUpdateModal(false); 
        })
        .catch((error) => {
            Swal.fire('Error', error.response?.data?.error || 'Failed to update students', 'error');
        });
    };


    const getDepartmentName = (departmentId) => {
        const department = departments.find((d) => d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find((p) => p.program_id === programId);
        return program ? program.program_name : '';
    };


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


    // Sort users based on full name
    const handleSortFullName = () => {
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
        const fullNameA = `${a.first_name} ${a.middle_name || ''} ${a.last_name} ${a.suffix || ''}`.toLowerCase();
        const fullNameB = `${b.first_name} ${b.middle_name || ''} ${b.last_name} ${b.suffix || ''}`.toLowerCase();

        if (sortOrder === 'asc') {
        return fullNameA.localeCompare(fullNameB);
        } else {
        return fullNameB.localeCompare(fullNameA);
        }
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
    };

    // Sort users based on idnumber
    const handleSortIdNumber = () => {
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
        const idNumberA = parseInt(a.student_idnumber, 10);
        const idNumberB = parseInt(b.student_idnumber, 10);

        if (isNaN(idNumberA) || isNaN(idNumberB)) {
            return 0;
        }

        if (sortOrder === 'asc') {
            return idNumberA - idNumberB;
        } else {
            return idNumberB - idNumberA;
        }
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
};


  // Pagination logic
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

    const renderPagination = () => {
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
        const buttonStyle = {
            width: '30px', 
            height: '30px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #a0a0a0',
            backgroundColor: '#ebebeb',
            color: '#4a4a4a',
            fontSize: '0.75rem', 
            cursor: 'pointer',
        };
    
        const activeButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#a0a0a0',
            color: '#f1f1f1',
        };
    
        const disabledButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#ebebeb',
            color: '#a1a1a1',
            cursor: 'not-allowed',
        };
    
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: '#4a4a4a'}}>
                {/* Results per Page */}
                <div>
                    <label htmlFor="rowsPerPage" style={{ marginLeft: '120px', marginRight: '5px' }}>Results per page:</label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        style={{ fontSize: '14px', padding: '5px 25px', border: '1px solid #ccc', borderRadius: '3px' }}>
                        {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                            <option key={value} value={value}> {value} </option>))}
                    </select>
                </div>
        
                {/* Pagination Info and Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
                    {/* Page Info */}
                    <div style={{ marginRight: '10px' }}>Page {currentPage} of {totalPages}</div>
        
                    {/* Pagination Buttons */}
                    <div style={{ display: 'flex' }}>
                        <button
                            onClick={() =>
                                currentPage > 1 && handlePaginationChange(currentPage - 1)
                            }
                            disabled={currentPage === 1}
                            style={{
                                ...buttonStyle,
                                borderTopLeftRadius: '10px',
                                borderBottomLeftRadius: '10px',
                                ...(currentPage === 1 ? disabledButtonStyle : {}),
                            }}
                        >
                            ❮
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePaginationChange(number)}
                                style={number === currentPage ? activeButtonStyle : buttonStyle}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            onClick={() =>
                                currentPage < totalPages && handlePaginationChange(currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                            style={{
                                ...buttonStyle,
                                borderTopRightRadius: '10px',
                                borderBottomRightRadius: '10px',
                                ...(currentPage === totalPages ? disabledButtonStyle : {}),
                            }}
                        >
                            ❯
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    
// Render Table
const renderTable = () => {
    const activeUsers = users.filter(user => user.status !== 'archived');

        return (
            <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '3%' }}>
                                <input type="checkbox" checked={selectAll} onChange={handleSelectAll}/>
                            </th>
                            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '11%' }}>
                                <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                    onClick={handleSortIdNumber}
                                    >
                                    <span style={{ textAlign: 'center' }}>ID Number</span>
                                    {sortOrder === 'asc' ? (
                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                    ) : (
                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                    )}
                                </button>
                            </th>
                            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle' }}>
                                <button
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                    onClick={handleSortFullName}
                                    >
                                    <span style={{ textAlign: 'center' }}>Full Name</span>
                                    {sortOrder === 'asc' ? (
                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                    ) : (
                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                    )}
                                </button>
                            </th>
                            <th style={{ width: '10%' }}>Year Level</th>
                            <th>Program</th>
                            <th style={{ width: '12%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={index}>
                                    <td> <input type="checkbox" checked={selectedStudentIds.includes(user.student_idnumber)} onChange={() => handleSelectUser(user.student_idnumber)}/></td>
                                    <td>{user.student_idnumber}</td>
                                    <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
                                    <td>{user.year_level}</td>
                                    <td>{getProgramName(user.program_id)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                backgroundColor: user.status === 'active' ? '#DBF0DC' : '#F0DBDB',
                                                color: user.status === 'active' ? '#30A530' : '#D9534F',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                borderRadius: '30px',
                                                padding: '5px 20px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: user.status === 'active' ? '#30A530' : '#D9534F',
                                                    marginRight: '7px',
                                                }}
                                            />
                                            {user.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-around">
                                            <Button className="btn btn-secondary btn-sm" onClick={() => handleReadModalShow(user)}>
                                                <PersonIcon />
                                            </Button>
                                            <Button className="btn btn-success btn-sm" onClick={() => handleUpdateModalShow(user)}>
                                                <EditIcon />
                                            </Button>
                                        </div>
                                    </td>
                            </tr>
                        ))}
                </tbody>
        </Table>
    );
};
    
  
return (
    <div>
        {selectedStudentIds.length > 0 && (
        <BatchDepartmentalToolbar
            selectedItemsCount={selectedStudentIds.length}
            selectedStudentIds={selectedStudentIds}
        />
        )}
            
        {renderTable()}

        {renderPagination()}

        {/* View Student Modal */}
        <ViewStudentModal
            show={showReadModal}
            onHide={handleReadModalClose}
            user={selectedUser}
            departments={departments}
            programs={programs}
        />
        
        {/* Edit Student Modal */}
        <EditStudentModal
            show={showUpdateModal}
            onHide={handleUpdateModalClose} 
            user={selectedUser}
            fetchUsers={fetchUsers}
            departments={departments} 
            programs={programs} 
        />
    </div>
    );
};


export default DepartmentalStudentsTable;