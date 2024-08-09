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

export default function ManageSanctions() {
    const navigate = useNavigate();
    const [sanctions, setSanctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSanctionModal, setShowSanctionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [sanctionFormData, setSanctionFormData] = useState({
        sanction_code: '',
        sanction_name: '',
        status: ''
    });
    const [editSanctionId, setEditSanctionId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchSanctions();
    }, []);

    const fetchSanctions = async () => {
        try {
            const response = await axios.get('http://localhost:9000/sanctions', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSanctions(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch sanctions');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewSanction = () => {
        setShowSanctionModal(true);
    };

    const handleCloseSanctionModal = () => {
        setShowSanctionModal(false);
        setSanctionFormData({
            sanction_code: '',
            sanction_name: '',
            status: ''
        });
    };

    const handleSanctionChange = (e) => {
        const { name, value } = e.target;
        setSanctionFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSanctionSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-sanction', sanctionFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Sanction Added Successfully!',
                text: 'The new sanction has been added successfully.',
            });
            handleCloseSanctionModal();
            fetchSanctions();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the sanction. Please try again later!',
            });
        }
    };

    const handleEditSanction = (id) => {
        const sanction = sanctions.find(sanc => sanc.sanction_id === id);
        if (sanction) {
            setSanctionFormData({
                sanction_code: sanction.sanction_code,
                sanction_name: sanction.sanction_name,
                status: sanction.status
            });
            setEditSanctionId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/sanction/${editSanctionId}`, sanctionFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Sanction Updated Successfully!',
                text: 'The sanction has been updated successfully.',
            });
            setShowEditModal(false);
            fetchSanctions();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the sanction. Please try again later!',
            });
        }
    };

    const handleDeleteSanction = (id) => {
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
                    await axios.delete(`http://localhost:9000/sanction/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The sanction has been deleted.',
                        'success'
                    );
                    fetchSanctions();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the sanction. Please try again later!',
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
            <h6 className="page-title">Manage Sanctions</h6>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <SearchAndFilter />
                <button 
                    onClick={handleCreateNewSanction} 
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
                    Add Sanction
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', marginLeft: '20px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px', paddingLeft: '50px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>ID</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Sanction Code</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Sanction Name</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sanctions.map((sanction, index) => (
                            <tr key={sanction.sanction_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{sanction.sanction_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{sanction.sanction_code}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{sanction.sanction_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{sanction.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon 
                                        onClick={() => handleEditSanction(sanction.sanction_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff' }}
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteSanction(sanction.sanction_id)} 
                                        style={{ cursor: 'pointer', color: '#dc3545', marginLeft: '10px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Sanction Modal */}
            <Modal show={showSanctionModal} onHide={handleCloseSanctionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Sanction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSanctionSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Sanction Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="sanction_code" 
                                value={sanctionFormData.sanction_code}
                                onChange={handleSanctionChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sanction Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="sanction_name" 
                                value={sanctionFormData.sanction_name}
                                onChange={handleSanctionChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="status" 
                                value={sanctionFormData.status}
                                onChange={handleSanctionChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" style={buttonStyle}>
                            Add Sanction
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Sanction Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Sanction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Sanction Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="sanction_code" 
                                value={sanctionFormData.sanction_code}
                                onChange={handleSanctionChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sanction Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="sanction_name" 
                                value={sanctionFormData.sanction_name}
                                onChange={handleSanctionChange}
                                style={inputStyle}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="status" 
                                value={sanctionFormData.status}
                                onChange={handleSanctionChange}
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
