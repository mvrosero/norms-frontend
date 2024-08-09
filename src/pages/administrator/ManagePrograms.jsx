import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManagePrograms() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProgramModal, setShowProgramModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [programFormData, setProgramFormData] = useState({
        program_code: '',
        program_name: '',
        department_id: '',
        status: '',
    });
    const [editProgramId, setEditProgramId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:9000/programs', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setPrograms(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch programs');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewProgram = () => {
        setShowProgramModal(true);
    };

    const handleCloseProgramModal = () => {
        setShowProgramModal(false);
        setProgramFormData({
            program_code: '',
            program_name: '',
            department_id: '',
            status: '',
        });
    };

    const handleProgramChange = (e) => {
        const { name, value } = e.target;
        setProgramFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProgramSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-program', programFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Program Added Successfully!',
                text: 'The new program has been added successfully.',
            });
            handleCloseProgramModal();
            fetchPrograms();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the program. Please try again later!',
            });
        }
    };

    const handleEditProgram = (id) => {
        const program = programs.find(prog => prog.program_id === id);
        if (program) {
            setProgramFormData({
                program_code: program.program_code,
                program_name: program.program_name,
                department_id: program.department_id,
                status: program.status,
            });
            setEditProgramId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/program/${editProgramId}`, programFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Program Updated Successfully!',
                text: 'The program has been updated successfully.',
            });
            setShowEditModal(false);
            fetchPrograms();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the program. Please try again later!',
            });
        }
    };

    const handleDeleteProgram = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/program/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The program has been deleted.',
                        'success'
                    );
                    fetchPrograms();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the program. Please try again later!',
                    });
                }
            }
        });
    };

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    const buttonStyle = {
        backgroundColor: '#28a745',
        color: 'white',
        fontWeight: '600',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title">Manage Programs</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewProgram} 
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Add Program
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Program Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Program Code</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Department</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map((program, index) => (
                            <tr key={program.program_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{program.program_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{program.program_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{program.program_code}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{program.department_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{program.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon style={{ cursor: 'pointer' }} onClick={() => handleEditProgram(program.program_id)} />
                                    <DeleteIcon style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleDeleteProgram(program.program_id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={showProgramModal} onHide={handleCloseProgramModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Program</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleProgramSubmit}>
                        <Form.Group controlId="formProgramCode">
                            <Form.Label>Program Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter program code"
                                name="program_code"
                                value={programFormData.program_code}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProgramName">
                            <Form.Label>Program Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter program name"
                                name="program_name"
                                value={programFormData.program_name}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDepartmentId">
                            <Form.Label>Department ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter department ID"
                                name="department_id"
                                value={programFormData.department_id}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={programFormData.status}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={buttonStyle}>
                            Add Program
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Program</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formProgramCode">
                            <Form.Label>Program Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter program code"
                                name="program_code"
                                value={programFormData.program_code}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProgramName">
                            <Form.Label>Program Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter program name"
                                name="program_name"
                                value={programFormData.program_name}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDepartmentId">
                            <Form.Label>Department ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter department ID"
                                name="department_id"
                                value={programFormData.department_id}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={programFormData.status}
                                onChange={handleProgramChange}
                                required
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={buttonStyle}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
