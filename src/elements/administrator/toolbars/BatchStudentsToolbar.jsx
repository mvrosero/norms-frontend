import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const BatchStudentsToolbar = ({ selectedItemsCount, onEdit, onDelete, selectedStudentIds }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [yearLevel, setYearLevel] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [programId, setProgramId] = useState('');
  const [status, setStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
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
    setYearLevel('');
    setDepartmentId('');
    setProgramId('');
    setStatus('');
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentResponse, programResponse] = await Promise.all([
          axios.get('http://localhost:9000/departments'),
          axios.get('http://localhost:9000/programs'),
        ]);
        setDepartments(departmentResponse.data);
        setPrograms(programResponse.data);
      } catch (error) {
        console.error('Error fetching departments or programs:', error);
        setError('Failed to load departments or programs.');
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
  
    try {
      const updates = {
        ...(yearLevel && { year_level: yearLevel }),
        ...(departmentId && { department_id: departmentId }),
        ...(programId && { program_id: programId }),
        ...(status && { status: status }),
      };
  
      if (Object.keys(updates).length === 0) {
        setError('No fields to update.');
        return;
      }
  
      console.log('Submitting payload:', {
        student_ids: selectedStudentIds,
        updates: updates,
      });
  
      const response = await axios.put('http://localhost:9000/students', {
        student_ids: selectedStudentIds,
        updates: updates,
      });
  
      setSuccessMessage(response.data.message);
      handleModalClose();
    } catch (error) {
      console.error('Error updating students:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to update students. Please try again.');
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

      {/* Embedded Batch Edit Student Modal */}
      <Modal show={isModalVisible} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>BATCH UPDATE STUDENTS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="year_level">
              <Form.Label className="fw-bold">Year Level</Form.Label>
              <Form.Select
                name="year_level"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              >
                <option value="">Select Year Level</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
                <option value="Fifth Year">Fifth Year</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="department_id">
              <Form.Label className="fw-bold">Department</Form.Label>
              <Form.Select
                name="department_id"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.department_id} value={department.department_id}>
                    {department.department_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="program_id">
              <Form.Label className="fw-bold">Program</Form.Label>
              <Form.Select
                name="program_id"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="inactive">Archived</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
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
    color: '#DC3545',
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

export default BatchStudentsToolbar;
