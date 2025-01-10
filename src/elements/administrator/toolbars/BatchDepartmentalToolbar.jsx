import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const BatchDepartmentalToolbar = ({ selectedItemsCount, selectedStudentIds }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [yearLevel, setYearLevel] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [programId, setProgramId] = useState('');
  const [status, setStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


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


  // Fetch departments and programs 
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

  // Filter programs based on the selected department
  useEffect(() => {
    if (departmentId) {
      axios
        .get(`http://localhost:9000/programs/${departmentId}`)
        .then((response) => {
          setFilteredPrograms(response.data);  
        })
        .catch((error) => {
          console.error('Error fetching programs:', error);
          setFilteredPrograms([]);  
        });
    } else {
      setFilteredPrograms([]);  
    }
  }, [departmentId]);


  // Handle the submit departmental toolbar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const updates = {
      ...(yearLevel && { year_level: yearLevel }),
      ...(departmentId && { department_id: departmentId }),
      ...(programId && { program_id: programId }),
      ...(status && { status: status }),
    };

    if (Object.keys(updates).length === 0) {
      setError('No fields to update.');
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await Swal.fire({
        title: 'Are you sure you want to save the changes?',
        text: 'You are about to update the details of the selected students. These changes cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#B0B0B0',
        confirmButtonText: 'Yes, update them!',
        cancelButtonText: 'Cancel',
      });
      if (result.isConfirmed) {
        const response = await axios.put('http://localhost:9000/students', {
          student_ids: selectedStudentIds,
          updates: updates,
        });
        handleModalClose();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      } else {
        handleModalClose();
      }
    } catch (error) {
      console.error('Error updating students:', error.response?.data || error.message);
      handleModalClose();

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update students. Please try again.',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle the cancel departmental toolbar
  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure you want to cancel?',
      text: 'Any unsaved changes will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#B0B0B0',
      confirmButtonText: 'Yes, close it!',
      cancelButtonText: 'No, keep changes'
    }).then((result) => {
      if (result.isConfirmed) {
        handleModalClose(); 
      }
    });
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
        </div>
      </div>


      <Modal show={isModalVisible} onHide={handleModalClose} size="lg">
        <Modal.Header>
              <Button variant="link" onClick={handleCancel} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                  ×
              </Button>
              <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', marginLeft: '80px', marginRight: '80px' }}>
                BATCH UPDATE STUDENTS
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <Form onSubmit={handleSubmit}>

              <Row className="gy-4" style={{ marginLeft: '20px', marginRight: '20px' }}>
                <Col md={6}>
                  <Form.Group controlId="year_level">
                    <Form.Label className="fw-bold">Year Level</Form.Label>
                    <Form.Select
                      name="year_level"
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da'}}
                    >
                      <option value="">Select Year Level</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                      <option value="Fifth Year">Fifth Year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label className="fw-bold">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da'}}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
                </Col>
              </Row>

              <Row className="gy-4" style={{ marginLeft: '20px', marginRight: '20px' }}>
                <Form.Group controlId="department_id">
                  <Form.Label className="fw-bold" style={{ marginTop: '20px' }}>Department</Form.Label>
                  <Form.Control
                    as="select"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da'}}
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.department_id} value={department.department_id}>
                        {department.department_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>

              <Row className="gy-4" style={{ marginLeft: '20px', marginRight: '20px' }}>
              <Form.Group controlId="program_id" style={{ marginBottom: '20px' }} >
                  <Form.Label className="fw-bold" style={{ marginTop: '20px' }}>Program</Form.Label>
                  <Form.Control
                    as="select"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    style={{ backgroundColor: '#f2f2f2', border: '1px solid #ced4da'}}
                    disabled={!departmentId} 
                  >
                    <option value="" disabled>Select Program</option>
                    {filteredPrograms.map((program) => (
                      <option key={program.program_id} value={program.program_id}>
                        {program.program_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                </Row>
                  {/* Buttons */}
                  <div className="d-flex justify-content-end mt-3" style={{ marginLeft: '30px', marginRight: '30px' }}>
                      <button type="button" onClick={handleCancel} style={cancelButtonStyle}>
                          Cancel
                      </button>
                      <button type="submit" style={buttonStyle}>
                          Update
                      </button>
                  </div>
              </Form>
            </Modal.Body>
      </Modal>
    </div>
  );
};


// Set the styles for the toolbar
const buttonStyle = {
  backgroundColor: '#3B71CA',
  color: '#FFFFFF',
  fontWeight: '900',
  padding: '12px 25px',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  marginLeft: '10px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const cancelButtonStyle = {
    backgroundColor: '#8C8C8C',
    color: '#FFFFFF',
    fontWeight: '900',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
    marginRight: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '5px',
  },
};


export default BatchDepartmentalToolbar;
