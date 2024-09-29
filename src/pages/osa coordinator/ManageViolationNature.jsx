import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManageViolationNature() {
    const navigate = useNavigate();
    const [natures, setNatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNatureModal, setShowNatureModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [natureFormData, setNatureFormData] = useState({
        nature_code: '',
        nature_name: '',
        status: 'active' // Default status
    });
    const [editNatureId, setEditNatureId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchNatures();
    }, []);

    const fetchNatures = async () => {
        try {
            const response = await axios.get('http://localhost:9000/violation-natures', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setNatures(response.data); // Changed to setNatures
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch violation natures');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewNature = () => {
        setShowNatureModal(true);
    };

    const handleCloseNatureModal = () => {
        setShowNatureModal(false);
        resetFormData(); // Reset the form data when closing
    };

    const resetFormData = () => {
        setNatureFormData({
            nature_code: '',
            nature_name: '',
            status: 'active' // Reset to default
        });
    };

    const handleNatureChange = (e) => {
        const { name, value } = e.target;
        setNatureFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNatureSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/create-violationnature', natureFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Violation nature Added Successfully!',
                text: 'The new violation nature has been added successfully.',
            });
            handleCloseNatureModal();
            fetchNatures();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the violation nature. Please try again later!',
            });
        }
    };

    const handleEditNature = (id) => {
        const violation_nature = natures.find(sub => sub.nature_id === id);
        if (violation_nature) {
            setNatureFormData({
                nature_code: violation_nature.nature_code,
                nature_name: violation_nature.nature_name,
                status: violation_nature.status
            });
            setEditNatureId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/violation-nature/${editNatureId}`, natureFormData, { // Changed to natureFormData
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Violation nature Updated Successfully!',
                text: 'The violation nature has been updated successfully.',
            });
            setShowEditModal(false);
            fetchNatures();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the violation nature. Please try again later!',
            });
        }
    };

    const handleDeleteNature = (id) => {
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
                    await axios.delete(`http://localhost:9000/violation-nature/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted!', 'The violation nature has been deleted.', 'success');
                    fetchNatures();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the violation nature. Please try again later!',
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

    return (
        <div>
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Nature of Violation</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewNature} 
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
                    Add Violation Nature
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Violation Nature Code</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Violation Nature Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {natures.map((nature, index) => (
                            <tr key={nature.nature_id}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{nature.nature_code}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{nature.nature_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{nature.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon onClick={() => handleEditNature(nature.nature_id)} style={{ cursor: 'pointer' }} />
                                    <DeleteIcon onClick={() => handleDeleteNature(nature.nature_id)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Adding Violation Nature */}
            <Modal show={showNatureModal} onHide={handleCloseNatureModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Violation Nature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleNatureSubmit}>
                        <Form.Group controlId="nature_code">
                            <Form.Label>Violation Nature Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="nature_code"
                                value={natureFormData.nature_code}
                                onChange={handleNatureChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="nature_name">
                            <Form.Label>Violation Nature Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="nature_name"
                                value={natureFormData.nature_name}
                                onChange={handleNatureChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={natureFormData.status}
                                onChange={handleNatureChange}
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseNatureModal}>Close</Button>
                            <Button variant="primary" type="submit">Save Nature</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for Editing Violation Nature */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Violation Nature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="nature_code">
                            <Form.Label>Violation Nature Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="nature_code"
                                value={natureFormData.nature_code}
                                onChange={handleNatureChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="nature_name">
                            <Form.Label>Violation Nature Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="nature_name"
                                value={natureFormData.nature_name}
                                onChange={handleNatureChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={natureFormData.status}
                                onChange={handleNatureChange}
                                style={inputStyle}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                            <Button variant="primary" type="submit">Update Nature</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
