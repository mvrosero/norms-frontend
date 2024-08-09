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

export default function ManageOffenses() {
    const navigate = useNavigate();
    const [offenses, setOffenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOffenseModal, setShowOffenseModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [offenseFormData, setOffenseFormData] = useState({
        offense_code: '',
        offense_name: '',
        status: '',
        category_id: ''
    });
    const [editOffenseId, setEditOffenseId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchOffenses();
    }, []);

    const fetchOffenses = async () => {
        try {
            const response = await axios.get('http://localhost:9000/offenses', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setOffenses(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch offenses');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewOffense = () => {
        setShowOffenseModal(true);
    };

    const handleCloseOffenseModal = () => {
        setShowOffenseModal(false);
        setOffenseFormData({
            offense_code: '',
            offense_name: '',
            status: '',
            category_id: ''
        });
    };

    const handleOffenseChange = (e) => {
        const { name, value } = e.target;
        setOffenseFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOffenseSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-offense', offenseFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Offense Added Successfully!',
                text: 'The new offense has been added successfully.',
            });
            handleCloseOffenseModal();
            fetchOffenses();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the offense. Please try again later!',
            });
        }
    };

    const handleEditOffense = (id) => {
        const offense = offenses.find(off => off.offense_id === id);
        if (offense) {
            setOffenseFormData({
                offense_code: offense.offense_code,
                offense_name: offense.offense_name,
                status: offense.status,
                category_id: offense.category_id
            });
            setEditOffenseId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/offense/${editOffenseId}`, offenseFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Offense Updated Successfully!',
                text: 'The offense has been updated successfully.',
            });
            setShowEditModal(false);
            fetchOffenses();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the offense. Please try again later!',
            });
        }
    };

    const handleDeleteOffense = (id) => {
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
                    await axios.delete(`http://localhost:9000/offense/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The offense has been deleted.',
                        'success'
                    );
                    fetchOffenses();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the offense. Please try again later!',
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
            <CoordinatorNavigation />
            <CoordinatorInfo />
            <h6 className="page-title">Manage Offenses</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewOffense} 
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
                    Add Offense
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Offense Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Offense Code</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Category ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offenses.map((offense, index) => (
                            <tr key={offense.offense_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.offense_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.offense_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.offense_code}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.category_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon 
                                        onClick={() => handleEditOffense(offense.offense_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff' }}
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteOffense(offense.offense_id)} 
                                        style={{ cursor: 'pointer', color: '#dc3545', marginLeft: '10px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Offense Modal */}
            <Modal show={showOffenseModal} onHide={handleCloseOffenseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Offense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleOffenseSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Offense Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="offense_code" 
                                value={offenseFormData.offense_code}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Offense Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="offense_name" 
                                value={offenseFormData.offense_name}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="status" 
                                value={offenseFormData.status}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category ID</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="category_id" 
                                value={offenseFormData.category_id}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" style={buttonStyle}>
                            Add Offense
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Offense Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Offense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Offense Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="offense_code" 
                                value={offenseFormData.offense_code}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Offense Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="offense_name" 
                                value={offenseFormData.offense_name}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="status" 
                                value={offenseFormData.status}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category ID</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="category_id" 
                                value={offenseFormData.category_id}
                                onChange={handleOffenseChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" style={buttonStyle}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
