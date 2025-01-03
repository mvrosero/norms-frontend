import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
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

const EmployeesTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showReadModal, setShowReadModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [headers, setHeaders] = useState({});
    const [deletionStatus, setDeletionStatus] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);  
    const [selectAll, setSelectAll] = useState(false);  
    const [sortConfig, setSortConfig] = useState({ key: 'employee_idnumber', direction: 'asc' }); // Sorting state

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/employees', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
        }
    }, [headers, deletionStatus]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/roles', { headers });
            setRoles(response.data);
            console.log('Fetched roles:', response.data); // Add this line to check the roles
        } catch (error) {
            console.error('Error fetching roles:', error.response ? error.response.data : error.message);
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

    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.role_id === roleId);
        console.log('Role ID:', roleId, 'Role Name:', role ? role.role_name : 'Not Found'); // Add this line for debugging
        return role ? role.role_name : 'Unknown Role';
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
            await axios.delete(`http://localhost:9000/employee/${userId}`, { headers });
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
                text: 'An error occurred while deleting user. Please try again later.',
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
        if (selectAll) {
            setSelectedEmployeeIds([]);
        } else {
            const allIds = users.map(user => user.employee_idnumber);
            setSelectedEmployeeIds(allIds);
        }
        setSelectAll(!selectAll);
        };

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
            // Make sure you're passing the correct employee IDs in the request body
            await axios.delete('http://localhost:9000/employees', {
                data: { employee_ids: selectedEmployeeIds },
                headers
            });
            Swal.fire({
                icon: 'success',
                text: 'Successfully deleted selected employees.'
            });
            setDeletionStatus(prevStatus => !prevStatus);  // Trigger re-fetch of users
            setSelectedEmployeeIds([]);  // Clear the selection after deletion
        } catch (error) {
            console.error('Error deleting employees:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                text: 'Failed to delete selected employees. Please try again.'
            });
        }
    };
    

  // Handle batch update
  const handleBatchUpdate = (updates) => {
    axios
      .put('http://localhost:9000/employees', {
        employee_ids: selectedEmployeeIds,
        updates,
      })
      .then((response) => {
        Swal.fire('Success', 'Batch update successful', 'success');
        fetchUsers(); // Re-fetch users after a successful update
        setShowUpdateModal(false); // Close the update modal
      })
      .catch((error) => {
        Swal.fire('Error', error.response?.data?.error || 'Failed to update employees', 'error');
      });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];

        // Special handling for full name sorting
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


  // Pagination
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


  // Render Custom Pagination
const renderPagination = () => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const buttonStyle = {
    width: '30px', // Fixed width for equal size
    height: '30px', // Fixed height for equal size
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #a0a0a0',
    backgroundColor: '#ebebeb',
    color: '#4a4a4a',
    fontSize: '0.75rem', // Smaller font size
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
                style={{
                    fontSize: '14px',
                    padding: '5px 25px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                }}
            >
                {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                    <option key={value} value={value}> {value} </option>
                ))}
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
    return (
      <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
        <thead>
          <tr>
            <th style={{ width: '3%' }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th style={{ width: '12%' }} onClick={() => handleSort('employee_idnumber')}>
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
            <th onClick={() => handleSort('full_name')}>
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
          {/* Loop over currentUsers to display only the users on the current page */}
          {currentUsers.map(user => (
            <tr key={user.employee_idnumber}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedEmployeeIds.includes(user.employee_idnumber)}
                  onChange={() => handleSelectUser(user.employee_idnumber)}
                />
              </td>
              <td>{user.employee_idnumber}</td>
              <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</td>
              <td>{getRoleName(user.role_id)}</td>
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
          ))}
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

        {/* Custom Pagination */}
        {renderPagination()}

  
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

export default EmployeesTable;
