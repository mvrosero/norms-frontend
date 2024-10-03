// ManageAcademicYears.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';
import EditAcademicYearModal from '../modals/EditAcademicYearModal'; // Import the new modal

export default function ManageAcademicYears() {
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        acadyear_code: '',
        start_year: '',
        end_year: '',
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
        setFormData({ acadyear_code: '', start_year: '', end_year: '', status: 'active' });
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
        setFormData({ acadyear_code: academicYear.acadyear_code, start_year: academicYear.start_year, end_year: academicYear.end_year, status: academicYear.status });
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
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/academic_year/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted!', 'The academic year has been deleted.', 'success');
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

    const buttonStyle = {
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
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title">Manage Academic Years</h6>
            <SearchAndFilter />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <Button onClick={handleOpenModal} style={buttonStyle}>
                    Add Academic Year
                    <FaPlus style={{ marginLeft: '10px' }} />
                </Button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px', paddingLeft: '20px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: 'auto', marginRight: 'auto' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>Code</th>
                            <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>Start Year</th>
                            <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>End Year</th>
                            <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>Status</th>
                            <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {academicYears.map((year) => (
                            <tr key={year.acadyear_id}>
                                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{year.acadyear_code}</td>
                                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{year.start_year}</td>
                                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{year.end_year}</td>
                                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{year.status}</td>
                                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                                    <Button onClick={() => handleEdit(year.acadyear_id)}>
                                        <EditIcon />
                                    </Button>
                                    <Button onClick={() => handleDelete(year.acadyear_id)}>
                                        <DeleteIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Include the EditAcademicYearModal here */}
            <EditAcademicYearModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleChange={handleChange} 
                editMode={editMode} 
            />
        </div>
    );
}
