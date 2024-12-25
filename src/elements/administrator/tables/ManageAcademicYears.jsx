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

import AddAcademicYearModal from '../modals/AddAcademicYearModal'; 
import EditAcademicYearModal from '../modals/EditAcademicYearModal';
import folderBackground from '../../../components/images/folder_background.png';

export default function ManageAcademicYears() {
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false); // Add modal state
    const [showEditModal, setShowEditModal] = useState(false); // Edit modal state
    const [formData, setFormData] = useState({
        acadyear_code: '',
        start_year: '',
        end_year: '',
        status: 'active',
    });
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

    const handleOpenAddModal = () => setShowAddModal(true); // Open Add Modal
    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setFormData({ acadyear_code: '', start_year: '', end_year: '', status: 'active' });
    };

    const handleOpenEditModal = (id) => {
        const academicYear = academicYears.find((year) => year.acadyear_id === id);
        setFormData({
            acadyear_code: academicYear.acadyear_code,
            start_year: academicYear.start_year,
            end_year: academicYear.end_year,
            status: academicYear.status
        });
        setCurrentAcademicYearId(id);
        setShowEditModal(true); // Open Edit Modal
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentAcademicYearId(null);
        setFormData({ acadyear_code: '', start_year: '', end_year: '', status: 'active' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentAcademicYearId) {
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
            handleCloseAddModal();
            handleCloseEditModal();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while saving the academic year. Please try again later!',
            });
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Confirm Delete',
            text: "Are you sure you want to delete this academic year? Deleting this academic year will also affect all associated data.",
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

    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'active') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'inactive') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else {
            backgroundColor = '#EDEDED';
            textColor = '#6C757D'; 
        }

        return (
            <div style={{
                backgroundColor,
                color: textColor,
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: '30px',
                padding: '5px 20px',
                display: 'inline-flex',
                alignItems: 'center',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: textColor,
                    marginRight: '7px',
                }} />
                {status}
            </div>
        );
    };

    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <div
                style={{
                    backgroundImage: `url(${folderBackground})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    width: '100vw',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    paddingTop: '40px',
                    marginBottom: '20px'
                }}
            >
                {/* Title Section */}
                <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                    <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '100px' }}>
                        Manage Academic Years
                    </h6>
                </div>
                {/* Search and Add Button */}
                <div style={{ marginTop: '5px', marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '850px' }}><SearchAndFilter /></div>
                    <button 
                        onClick={handleOpenAddModal} 
                        style={{
                            backgroundColor: '#FAD32E',
                            color: 'white',
                            fontWeight: '900',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Add Academic Year
                        <FaPlus style={{ marginLeft: '10px' }} />
                    </button>
                </div>

                {/* Academic Year Table */}
                <div style={{ width: '90%', marginBottom: '40px' }}>
                    <table
                        className="table table-hover table-bordered"
                        style={{
                            marginTop: '10px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            backgroundColor: 'white',
                        }}
                    >
                        <thead style={{ backgroundColor: '#FAD32E', textAlign: 'center' }}>
                            <tr>
                                <th style={{ width: '3%' }}>No.</th>
                                <th style={{ width: '15%' }}>Code</th>
                                <th style={{ width: '15%' }}>Start Year</th>
                                <th style={{ width: '15%' }}>End Year</th>
                                <th style={{ width: '10%' }}>Status</th>
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicYears.map((year, index) => (
                                <tr key={year.acadyear_id}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td>{year.acadyear_code}</td>
                                    <td style={{ textAlign: 'center' }}>{year.start_year}</td>
                                    <td style={{ textAlign: 'center' }}>{year.end_year}</td>
                                    <td style={{ textAlign: 'center' }}>{renderStatus(year.status)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <EditIcon
                                            onClick={() => handleOpenEditModal(year.acadyear_id)}
                                            style={{ cursor: 'pointer', color: '#007bff', marginRight: '15px' }}
                                        />
                                        <DeleteIcon
                                            onClick={() => handleDelete(year.acadyear_id)}
                                            style={{ cursor: 'pointer', color: '#dc3545' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Academic Year Modal */}
            <AddAcademicYearModal 
                show={showAddModal} 
                handleClose={handleCloseAddModal} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleChange={handleChange} 
            />

            {/* Edit Academic Year Modal */}
            <EditAcademicYearModal 
                show={showEditModal} 
                handleClose={handleCloseEditModal} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleChange={handleChange} 
            />
        </div>
    );
}
