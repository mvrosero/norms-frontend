import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SFforSettingsTable from '../searchandfilters/SFforSettingsTable';
import AddAcademicYearModal from '../modals/AddAcademicYearModal'; 
import EditAcademicYearModal from '../modals/EditAcademicYearModal';
import folderBackground from '../../../components/images/folder_background.png';

export default function ManageAcademicYears() {
    const [academicYears, setAcademicYears] = useState([]);
    const [allItems, setAllItems] = useState([]);  
    const [filteredAcademicYears, setFilteredAcademicYears] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false); 
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


    // Fetch academic years
    const fetchAcademicYears = useCallback(async () => {
        setLoading(true); 
        setError(null); 
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('https://test-backend-api-2.onrender.com/academic_years', { headers });
            setAcademicYears(response.data);
            setAllItems(response.data);  
            setFilteredAcademicYears(response.data);  
            setLoading(false);
        } catch (error) {
            console.error('Error fetching academic years:', error.response || error.message || error);
            setError(true); 
            setLoading(false);
        }
    }, []);


        // Handle search query changes
        const handleSearch = (query) => {
            setSearchQuery(query);
        };
    
        // Handle filter changes (status)
        const handleFilterChange = (filters) => {
            console.log('Updated Filters:', filters);
            setFilters(filters);
        };
    
        // Apply search query and filters to academic years
        useEffect(() => {
            const filtered = allItems.filter(academic_year => {
                const normalizedQuery = searchQuery.toLowerCase();

                // Check if searchQuery is a number (for searching years)
                const isNumberQuery = !isNaN(Number(searchQuery));

                const matchesQuery = 
                    academic_year.acadyear_code.toLowerCase().includes(normalizedQuery) ||
                    (isNumberQuery && 
                        (academic_year.start_year.toString().includes(searchQuery) || 
                        academic_year.end_year.toString().includes(searchQuery))
                    );
    
                const matchesStatus = filters.status ? academic_year.status === filters.status : true;
    
                return matchesQuery && matchesStatus;
            });
            setFilteredAcademicYears(filtered);
        }, [searchQuery, filters, allItems]);
        useEffect(() => {
            fetchAcademicYears();
        }, [fetchAcademicYears]);


    const handleOpenAddModal = () => setShowAddModal(true); 
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
        setShowEditModal(true); 
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentAcademicYearId(null);
        setFormData({ acadyear_code: '', start_year: '', end_year: '', status: 'active' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    // Handle the create academic year
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentAcademicYearId) {
                await axios.put(`https://test-backend-api-2.onrender.com/academic_year/${currentAcademicYearId}`, formData, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Academic Year Updated Successfully!',
                    text: 'The academic year has been updated successfully.',
                });
            } else {
                await axios.post('https://test-backend-api-2.onrender.com/register-academicyear', formData, {
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
            const errorMessage = error.response?.data?.error || 'An error occurred while saving the academic year. Please try again later!';
            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            });
        }
    };


    // Handle the delete academic year
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this academic year?',
            text: "Deleting this academic year will also affect all associated data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://test-backend-api-2.onrender.com/academic_year/${id}`, {
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


    // Set the styles for the status
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
                    <div style={{ width: '850px' }}><SFforSettingsTable onSearch={handleSearch} onFilterChange={handleFilterChange}/></div>
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
                    <table className="table table-hover table-bordered" style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
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
                        {filteredAcademicYears.length > 0 ? (
                            filteredAcademicYears.map((year, index) => (
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>No academic years found</td>
                                    </tr>
                                )}
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
