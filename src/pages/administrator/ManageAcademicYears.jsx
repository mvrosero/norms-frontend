import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from './AdminNavigation';
import AdminInfo from './AdminInfo';
import SearchAndFilter from '../general/SearchAndFilter';

export default function ManageAcademicYears() {
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        acadyear_name: '',
        status: 'active',
    });
    const [editMode, setEditMode] = useState(false);
    const [currentAcademicYearId, setCurrentAcademicYearId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        }
        fetchAcademicYears();
    }, [navigate]);

    const fetchAcademicYears = async () => {
        try {
            const response = await axios.get('http://localhost:9000/academic_years', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setAcademicYears(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch academic years.');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ acadyear_name: '', status: 'active' });
        setEditMode(false);
        setCurrentAcademicYearId(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:9000/academic_year/${currentAcademicYearId}`, formData, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Academic Year Updated Successfully!',
                    text: 'The academic year has been updated successfully.',
                });
            } else {
                await axios.post('http://localhost:9000/register-academicyear', formData, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Academic Year Added Successfully!',
                    text: 'The new academic year has been added successfully.',
                });
            }
            fetchAcademicYears();
            handleCloseModal();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while saving the academic year. Please try again later!',
            });
        }
    };

    const handleEdit = (id) => {
        const academicYear = academicYears.find((year) => year.acadyear_id === id);
        setFormData({ acadyear_name: academicYear.acadyear_name, status: academicYear.status });
        setEditMode(true);
        setCurrentAcademicYearId(id);
        handleOpenModal();
    };

    const handleDelete = async (id) => {
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
                    await axios.delete(`http://localhost:9000/academic_year/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The academic year has been deleted.',
                        'success'
                    );
                    fetchAcademicYears();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the academic year. Please try again later!',
                    });
                }
            }
        });
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title">Manage Academic Years</h6>
            <SearchAndFilter/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <Button onClick={handleOpenModal} style={{ backgroundColor: '#FAD32E', color: 'white', fontWeight: '900' }}>
                    Add Academic Year
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: 'auto', marginRight: 'auto' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Academic Year</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {academicYears.map((year, index) => (
                            <tr key={year.acadyear_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{year.acadyear_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{year.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon 
                                        onClick={() => handleEdit(year.acadyear_id)} 
                                        style={{ cursor: 'pointer', color: 'blue', marginRight: '10px' }} 
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDelete(year.acadyear_id)} 
                                        style={{ cursor: 'pointer', color: 'red' }} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for the Add/Edit Academic Year */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit Academic Year' : 'Add New Academic Year'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formAcademicYearName">
                            <Form.Label>Academic Year Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter academic year name"
                                name="acadyear_name"
                                value={formData.acadyear_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus" className="mt-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            {editMode ? 'Save Changes' : 'Add Academic Year'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
