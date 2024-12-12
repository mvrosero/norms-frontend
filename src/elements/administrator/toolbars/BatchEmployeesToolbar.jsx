import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const BatchEmployeesToolbar = ({ selectedItemsCount, selectedEmployeeIds, onDelete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState('');
  const [roles, setRoles] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setRoleId('');
    setStatus('');
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await axios.get('http://localhost:9000/roles');
        // Filter out role with role_id = 3 (for students)
        setRoles(roleResponse.data.filter(role => role.role_id !== 3));
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('Failed to load roles.');
      }
    };

    

    if (isModalVisible) {
      fetchData();
    }
  }, [isModalVisible]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const updates = {
      ...(roleId && { role_id: roleId }),
      ...(status && { status: status }),
    };

    // Debugging: log the payload before sending the request
    console.log('Selected Employee IDs:', selectedEmployeeIds);
    console.log('Updates:', updates);

    if (Object.keys(updates).length === 0) {
      setError('No fields to update.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put('http://localhost:9000/employees', {
        employee_ids: selectedEmployeeIds,
        updates: updates,
      });

      // Debugging: log the response from the server
      console.log('Response:', response);

      handleModalClose();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating employees:', error.response?.data || error.message);

      handleModalClose();

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update employees. Please try again.',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={styles.toolbar}>
      <button style={styles.closeButton} onClick={handleClose}>
        &times;
      </button>
      <div style={styles.content}>
        <div style={styles.itemInfoContainer}>
          <div style={styles.itemCountContainer}>
            <span style={styles.itemCount}>{selectedItemsCount}</span>
          </div>
          <span style={styles.selectedText}>
            item{selectedItemsCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.editButton} onClick={handleEdit}>
            <i className="fas fa-pen" style={styles.icon}></i> Edit
          </button>
          <button style={styles.deleteButton} onClick={onDelete}>
            <i className="fas fa-trash" style={styles.icon}></i> Delete
          </button>
        </div>
      </div>

      <Modal show={isModalVisible} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>BATCH UPDATE EMPLOYEES</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="role_id">
              <Form.Label className="fw-bold">Role</Form.Label>
              <Form.Select
                name="role_id"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label className="fw-bold">Status</Form.Label>
              <Form.Select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const styles = {
  toolbar: {
    width: '600px',
    padding: '15px',
    backgroundColor: '#3B3B3B',
    borderRadius: '100px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1000,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '25px',
    cursor: 'pointer',
    color: '#C1C1C1',
    marginRight: '20px',
    marginLeft: '10px',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginLeft: '20px',
  },
  itemCountContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#C1C1C1',
  },
  itemCount: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'normal',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#E8EBF6',
    color: '#4169E1',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    padding: '7px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F2DFE1',
    color: '#FF5C5C',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    padding: '7px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '5px',
  },
};

export default BatchEmployeesToolbar;
