import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import EditEmployeeModal from '../modals/EditEmployeeModal';
import ViewEmployeeModal from '../modals/ViewEmployeeModal';
import BatchEmployeesToolbar from '../toolbars/BatchEmployeesToolbar';
import "../../../styles/Employees.css";

export default function ({filters, searchQuery}) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);  
    const [selectAll, setSelectAll] = useState(false); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
  

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

     // Sorting state for employee id number
    const [sortConfig, setSortConfig] = useState({ key: 'employee_idnumber', direction: 'asc' }); 
    

    // Fetch the employees
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/employees', { headers });
            setUsers(response.data);
          } catch (error) {
            setError(error.response ? error.response.data : error.message); 
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false); 
        }
    }, [headers, deletionStatus]);

    // Fetch the roles
    const fetchRoles = useCallback(async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/roles', { headers });
            setRoles(response.data);
            console.log('Fetched roles:', response.data); 
          } catch (error) {
            setError(error.response ? error.response.data : error.message); 
            console.error('Error fetching roles:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false); 
        }
    }, [headers]);
    useEffect(() => {
        fetchUsers();
        fetchRoles();  
    }, [fetchUsers, fetchRoles]); 


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


    // Handle the delete employee
    const deleteUser = async (userId) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure you want to delete this user?',
            text: 'Deleting this user will also affect all associated data.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            return result.isConfirmed;
        });
        if (!isConfirm) {
            return;
        }
        try {
            await axios.delete(`https://test-backend-api-2.onrender.com/employee/${userId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            setDeletionStatus(prevStatus => !prevStatus);
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                text: 'This user cannot be deleted because there are associated records linked to it.',
            });
        }
    };


    // Handle the batch delete employee
    const handleBatchDelete = async () => {
      const isConfirm = await Swal.fire({
          title: 'Are you sure you want to delete these users?',
          text: "Deleting these users will also affect all associated data.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#B0B0B0',
          confirmButtonText: 'Yes, delete it'
      }).then((result) => result.isConfirmed);

      if (!isConfirm) return;

      try {
          await axios.delete('https://test-backend-api-2.onrender.com/employees', {
              data: { employee_ids: selectedEmployeeIds },
              headers
          });
          Swal.fire({
              icon: 'success',
              text: 'Successfully deleted selected employees.'
          });
          setDeletionStatus(prevStatus => !prevStatus);  
          setSelectedEmployeeIds([]);  
      } catch (error) {
          console.error('Error deleting employees:', error.response?.data || error.message);
          Swal.fire({
              icon: 'error',
              text: 'Selected employees cannot be deleted because there are associated records linked to them.'
          });
      }
  };


  // Handle selecting individual users
  const handleSelectUser = (userId) => {
    setSelectedEmployeeIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(userId)) {
        return prevSelectedIds.filter(id => id !== userId);
      } else {
        return [...prevSelectedIds, userId];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`.toLowerCase();
        const employeeId = user.employee_idnumber.toLowerCase();
        const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) || employeeId.includes(searchQuery.toLowerCase());

        const matchesFilters = Object.keys(filters).every(key => {
            if (filters[key]) {
                if (key === 'role' && user.role_name !== filters[key]) return false;
                if (key === 'status' && user.status !== filters[key]) return false;
            }
            return true;
        });
        return matchesSearchQuery && matchesFilters; 
    });
    if (selectAll) {
        setSelectedEmployeeIds([]); 
    } else {
        const allFilteredIds = filteredUsers.map(user => user.employee_idnumber);
        setSelectedEmployeeIds(allFilteredIds); 
    }
    setSelectAll(!selectAll);
  };


   // Sort users based on full name
    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });

      const sortedUsers = [...users].sort((a, b) => {
          let aValue = a[key];
          let bValue = b[key];

          if (key === 'full_name') {
              aValue = `${a.first_name} ${a.middle_name || ''} ${a.last_name} ${a.suffix || ''}`.trim().toLowerCase();
              bValue = `${b.first_name} ${b.middle_name || ''} ${b.last_name} ${b.suffix || ''}`.trim().toLowerCase();
          }

          if (aValue < bValue) return direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return direction === 'asc' ? 1 : -1;
          return 0;
      });
      setUsers(sortedUsers);
  };


// Pagination logic
const indexOfLastUser = currentPage * rowsPerPage;
const indexOfFirstUser = indexOfLastUser - rowsPerPage;
const totalPages = Math.ceil(users.length / rowsPerPage);

const handlePaginationChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

const handleRowsPerPageChange = (e) => {
  setRowsPerPage(Number(e.target.value));
  setCurrentPage(1);
};

const renderPagination = () => {
  if (loading) return null;

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
                  {Array.from({ length: 5 }, (_, i) => (i + 1) * 5).map((value) => (
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


const renderTable = () => {

    // Calculate filteredUsers directly from users
    const filteredUsers = users.filter(user => {

        const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`.toLowerCase();
        const employeeId = user.employee_idnumber.toLowerCase();
        const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) || employeeId.includes(searchQuery.toLowerCase());

        const matchesFilters = Object.keys(filters).every(key => {
            if (filters[key]) {  
                if (key === 'role' && user.role_name !== filters[key]) return false;
                if (key === 'status' && user.status !== filters[key]) return false;
            }
            return true;
        });
        return matchesSearchQuery && matchesFilters; 
      });

    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Show loading spinner when data is being fetched
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <div style={{ width: "50px", height: "50px", border: "6px solid #f3f3f3", borderTop: "6px solid #a9a9a9", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <style> {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`} </style>
        </div>
      );
    }


return (
  <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
        <thead>
          <tr>
            <th style={{ width: '3%' }}><input type="checkbox" checked={selectAll} onChange={handleSelectAll}/></th>
            <th style={{ width: '5%' }}>ID</th>
            <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', height: '20px', width: '11%' }} onClick={() => handleSort('employee_idnumber')}>
                ID Number{' '}
                {sortConfig.key === 'employee_idnumber' ? (
                  sortConfig.direction === 'asc' ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  <ArrowDropDownIcon />
                )}
            </th>
            <th style={{ padding: '0', verticalAlign: 'middle', height: '40px' }} onClick={() => handleSort('full_name')}>
                Full Name{' '}
                {sortConfig.key === 'full_name' ? (
                  sortConfig.direction === 'asc' ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  <ArrowDropDownIcon />
                )}
            </th>
            <th style={{ width: '17%' }}>Role</th>
            <th style={{ width: '13%' }}>Status</th>
            <th style={{ width: '13%' }}>Actions</th>
          </tr>
        </thead>
      <tbody>
        {filteredUsers &&filteredUsers.length > 0 ? (
          currentUsers.map(user => (
            <tr key={user.employee_idnumber}>
              <td><input type="checkbox" checked={selectedEmployeeIds.includes(user.employee_idnumber)} onChange={() => handleSelectUser(user.employee_idnumber)}/>
              </td>
              <td style={{ textAlign: 'center' }}>{user.user_id}</td>
              <td>{user.employee_idnumber}</td>
              <td>
                  <Link 
                      to={`/admin-accounthistory/${user.user_id}`}
                      style={{ textDecoration: 'none', color: 'black' }}
                      onMouseEnter={(e) => {
                          e.target.style.textDecoration = 'underline';
                          e.target.style.color = '#4682B4'; 
                      }}
                      onMouseLeave={(e) => {
                          e.target.style.textDecoration = 'none';
                          e.target.style.color = '#000000';
                      }}
                  >
                      {`${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix}`}
                  </Link>
              </td>
              <td>{user.role_name}</td>
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
                  <Button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.user_id)}>
                    <DeleteIcon />
                  </Button>
                </div>
              </td>
            </tr>
              ))
            ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
                </tr>
            )}
        </tbody>
      </Table>
    );
  };
  
  
return (
      <div>
          {selectedEmployeeIds.length > 0 && (
          <BatchEmployeesToolbar
              selectedItemsCount={selectedEmployeeIds.length}
              selectedEmployeeIds={selectedEmployeeIds}
              onDelete={handleBatchDelete}
          />
          )}

          {renderTable()}

          {!loading && renderPagination()}

          {/* View Employee Modal */}
          <ViewEmployeeModal
                show={showReadModal}
                onHide={handleReadModalClose}
                user={selectedUser}
                roles={roles}
            />

          {/* Edit Employee Modal */}
          <EditEmployeeModal
                show={showUpdateModal}
                onHide={handleUpdateModalClose} 
                user={selectedUser}
                fetchUsers={fetchUsers}
                headers={headers}
                roles={roles}
            />
      </div>
    );
}



