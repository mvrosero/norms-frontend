import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import AddOffenseModal from '../../elements/osa coordinator/modals/AddOffenseModal';
import EditOffenseModal from '../../elements/osa coordinator/modals/EditOffenseModal';

export default function ManageOffenses() {
    const navigate = useNavigate();
    const [offenses, setOffenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOffenseModal, setShowOffenseModal] = useState(false);
    const [showEditOffenseModal, setShowEditOffenseModal] = useState(false);
    const [offenseFormData, setOffenseFormData] = useState({
        offense_code: '',
        offense_name: '',
        status: 'active',
        category_id: '',
        subcategory_id: ''
    });

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

    const handleCreateNewOffense = () => setShowOffenseModal(true);

    const handleCloseOffenseModal = () => {
        setShowOffenseModal(false);
        setOffenseFormData({
            offense_code: '',
            offense_name: '',
            status: 'active',
            category_id: '',
            subcategory_id: ''
        });
    };

    const handleCloseEditOffenseModal = () => {
        setShowEditOffenseModal(false);
        setOffenseFormData({
            offense_code: '',
            offense_name: '',
            status: 'active',
            category_id: '',
            subcategory_id: ''
        });
    };

    const handleOffenseChange = (e) => {
        const { name, value } = e.target;
        setOffenseFormData(prevState => ({ ...prevState, [name]: value }));
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

    const handleEditOffense = (offense) => {
        setOffenseFormData(offense);
        setShowEditOffenseModal(true);
    };

    const handleOffenseUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/offense/${offenseFormData.offense_id}`, offenseFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Offense Updated Successfully!',
                text: 'The offense has been updated successfully.',
            });
            handleCloseEditOffenseModal();
            fetchOffenses();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the offense. Please try again later!',
            });
        }
    };

    // Define handleDeleteOffense function
    const handleDeleteOffense = async (offenseId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the offense.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:9000/offenses/${offenseId}`, {
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
    };

    const inputStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        height: '40px',
        width: '100%'
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Subcategory ID</th> {/* New Column */}
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Status</th>
                            <th style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px', backgroundColor: '#a8a8a8', color: 'white' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offenses.map(offense => (
                            <tr key={offense.offense_id}>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.offense_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.offense_name}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.offense_code}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.category_id}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.subcategory_id}</td> {/* New Column */}
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>{offense.status}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #ddd', padding: '8px' }}>
                                    <EditIcon
                                        onClick={() => handleEditOffense(offense)}
                                        style={{ cursor: 'pointer', color: '#FAD32E' }}
                                    />
                                    <DeleteIcon
                                        onClick={() => handleDeleteOffense(offense.offense_id)}
                                        style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddOffenseModal
                show={showOffenseModal}
                handleClose={handleCloseOffenseModal}
                offenseFormData={offenseFormData}
                handleOffenseChange={handleOffenseChange}
                handleOffenseSubmit={handleOffenseSubmit}
                inputStyle={inputStyle}
            />

            <EditOffenseModal
                show={showEditOffenseModal}
                handleClose={handleCloseEditOffenseModal}
                offenseFormData={offenseFormData}
                handleOffenseChange={handleOffenseChange}
                handleOffenseSubmit={handleOffenseUpdateSubmit}
                inputStyle={inputStyle}
            />
        </div>
    );
}
