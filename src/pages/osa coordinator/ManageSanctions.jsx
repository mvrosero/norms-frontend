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
import AddSanctionModal from '../../elements/osa coordinator/modals/AddSanctionModal';
import EditSanctionModal from '../../elements/osa coordinator/modals/EditSanctionModal';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            setSanctions(response.data);
        } catch (error) {
            setError('Failed to fetch sanctions');
        } finally {
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
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
                status: sanction.status // Ensure this is correctly set
            });
            setEditSanctionId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:9000/sanction/${editSanctionId}`, sanctionFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
        } finally {
            setIsSubmitting(false);
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
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    });
                    Swal.fire('Deleted!', 'The sanction has been deleted.', 'success');
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
                    }}
                >
                    Add Sanction
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>
            <div style={{ margin: 'auto', marginTop: '20px', marginBottom: '30px' }}>
                <table style={{ width: '90%', borderCollapse: 'collapse', marginLeft: '90px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sanction Code</th>
                            <th>Sanction Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sanctions.map((sanction) => (
                            <tr key={sanction.sanction_id}>
                                <td>{sanction.sanction_id}</td>
                                <td>{sanction.sanction_code}</td>
                                <td>{sanction.sanction_name}</td>
                                <td>{sanction.status}</td>
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
            <AddSanctionModal 
                show={showSanctionModal} 
                onHide={handleCloseSanctionModal} 
                fetchSanctions={fetchSanctions} 
            />

            {/* Edit Sanction Modal */}
            <EditSanctionModal 
                show={showEditModal} 
                handleClose={() => setShowEditModal(false)} 
                handleSubmit={handleEditSubmit} 
                sanctionFormData={sanctionFormData} 
                handleChange={handleSanctionChange} 
                isSubmitting={isSubmitting} 
            />
        </div>
    );
}
