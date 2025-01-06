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
import folderBackground from '../../../src/components/images/folder_background.png';

export default function ManageOffenses() {
    const navigate = useNavigate();
    const [offenses, setOffenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOffenseModal, setShowOffenseModal] = useState(false);
    const [showEditOffenseModal, setShowEditOffenseModal] = useState(false);
    const [editOffenseId, setEditOffenseId] = useState(null); 
    const [offenseFormData, setOffenseFormData] = useState({
        offense_code: '',
        offense_name: '',
        status: '',
        category_id: '',
        category_name: '',
        subcategory_id: '',
        subcategory_name: ''
    });


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [offensesPerPage] = useState(10);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        } else {
            fetchCategories(); 
            fetchSubcategories();  
        }
    }, [navigate]);
    
    useEffect(() => {
        fetchOffenses();
    }, []);
    
    // Fetch offenses
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
    
    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:9000/categories', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch categories');
            setLoading(false);
        }
    };
    
    // Fetch subcategories
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://localhost:9000/subcategories', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSubcategories(response.data); // Assuming setSubcategories exists for state
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch subcategories');
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


    // Handle the create offense
    const handleOffenseSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'You are not logged in or your session has expired.',
            });
            return;
        }
        try {
            await axios.post('http://localhost:9000/register-offense', offenseFormData, {
                headers: { 'Authorization': `Bearer ${token}` }
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
                text: error.response?.data?.message || 'An error occurred while adding the offense. Please try again later!',
            });
        }
    };


    // Handle the edit offense
    const handleEditOffense = (id) => {
        const offense = offenses.find(offe => offe.offense_id === id);
        if (offense) {
            setOffenseFormData({
                offense_code: offense.offense_code,
                offense_name: offense.offense_name,
                category_name: offense.category_name, 
                subcategory_name: offense.subcategory_name, 
                status: offense.status,
            });
            setEditOffenseId(id); // Set edit ID
            setShowEditOffenseModal(true);
        }
    };

    const handleOffenseUpdateSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            offense_code: offenseFormData.offense_code,
            offense_name: offenseFormData.offense_name,
            category_name: offenseFormData.category_name, 
            subcategory_name: offenseFormData.subcategory_name,
            status: offenseFormData.status,
        };
        try {
            await axios.put(`http://localhost:9000/offense/${editOffenseId}`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Offense Updated Successfully!',
                text: 'The offense has been updated successfully.',
            });

            setShowEditOffenseModal(false);
            fetchOffenses();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the offense. Please try again later!',
            });
        }
    };


     // Handle the delete offense
    const handleDeleteOffense = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this offense?',
            text: 'Deleting this offense will also affect all associated data.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/offense/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted!', 'The offense has been deleted.', 'success');
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


    // Pagination logic
    const indexOfLastOffense = currentPage * offensesPerPage;
    const indexOfFirstOffense = indexOfLastOffense - offensesPerPage;
    const currentOffenses = offenses.slice(indexOfFirstOffense, indexOfLastOffense);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(offenses.length / offensesPerPage);

    const buttonStyle = {
        width: '30px', 
        height: '30px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #a0a0a0',
        backgroundColor: '#ebebeb',
        color: '#4a4a4a',
        fontSize: '0.75rem',
        cursor: 'pointer',
    };

    const activeButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#a0a0a0',
        color: '#f1f1f1',
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#ebebeb',
        color: '#a1a1a1',
        cursor: 'not-allowed',
    };

    const handlePaginationChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);  
        }
    };
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }


return (
    <div>
        <CoordinatorNavigation />
        <CoordinatorInfo />
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
                    Manage Offenses
                </h6>
            </div>

            {/* Search and Add Button */}
            <div style={{  marginTop: '10px', marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '850px' }}><SearchAndFilter /></div>
                <button
                    onClick={handleCreateNewOffense}
                    style={{
                        backgroundColor: '#FAD32E',
                        color: 'white',
                        fontWeight: '900',
                        padding: '12px 18px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    Add Offense
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Offense Table */}
            <div style={{ width: '90%', marginBottom: '40px' }}>
            <table className="table table-hover table-bordered" style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>No.</th>
                            <th style={{ width: '14%' }}>Offense Code</th>
                            <th style={{ width: '30%' }}>Offense Name</th>
                            <th style={{ width: '15%' }}>Category Name</th>
                            <th style={{ width: '13%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOffenses.map((offense, index) => (
                            <tr key={offense.offense_id}>
                                <td style={{ textAlign: 'center' }}>{ (currentPage - 1) * offensesPerPage + (index + 1) }</td>
                                <td>{offense.offense_code}</td>
                                <td>{offense.offense_name}</td>
                                <td>{offense.category_name}</td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(offense.status)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <EditIcon
                                        onClick={() => handleEditOffense(offense.offense_id)}
                                        style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                                    />
                                    <DeleteIcon
                                        onClick={() => handleDeleteOffense(offense.offense_id)}
                                        style={{ cursor: 'pointer', color: '#dc3545' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination */}
                <div style = {{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '15px', marginRight: '30px' }}>
                    {/* Page Info */}
                    <div style={{ fontSize: '0.875rem', color: '#4a4a4a', marginRight: '10px' }}>
                        Page {currentPage} out of {totalPages}
                    </div>

                    {/* Previous Page Button with left rounded corners */}
                    <button
                        onClick={() => handlePaginationChange(currentPage - 1)}
                        style={{
                            ...buttonStyle,
                            borderTopLeftRadius: '8px',  // left rounded corner
                            borderBottomLeftRadius: '8px',
                            ...(currentPage === 1 ? disabledButtonStyle : {}),
                        }}
                        disabled={currentPage === 1}
                    >
                        ❮
                    </button>

                    {/* Page Numbers (only 3 visible) */}
                    {(() => {
                        let pageStart = currentPage - 1 > 0 ? currentPage - 1 : 1;
                        let pageEnd = pageStart + 2 <= totalPages ? pageStart + 2 : totalPages;

                        const pageTiles = [];
                        for (let i = pageStart; i <= pageEnd; i++) {
                            pageTiles.push(i);
                        }

                        return pageTiles.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                style={currentPage === number ? activeButtonStyle : buttonStyle}
                            >
                                {number}
                            </button>
                        ));
                    })()}

                    {/* Next Page Button with right rounded corners */}
                    <button
                        onClick={() => handlePaginationChange(currentPage + 1)}
                        style={{
                            ...buttonStyle,
                            borderTopRightRadius: '8px',  // right rounded corner
                            borderBottomRightRadius: '8px',
                            ...(currentPage === totalPages ? disabledButtonStyle : {}),
                        }}
                        disabled={currentPage === totalPages}
                    >
                        ❯
                    </button>
                </div>
            </div>
        </div>
            
        {/* Add Offense Modal */}
        <AddOffenseModal
            show={showOffenseModal}
            handleClose={handleCloseOffenseModal}
            offenseFormData={offenseFormData}
            handleOffenseChange={handleOffenseChange}
            handleOffenseSubmit={handleOffenseSubmit}
            categories={categories}
            subcategories={subcategories}
        />

        {/* Edit Offense Modal */}
        <EditOffenseModal
            show={showEditOffenseModal}
            handleClose={handleCloseEditOffenseModal}
            offenseFormData={offenseFormData}
            handleOffenseChange={handleOffenseChange}
            handleOffenseSubmit={handleOffenseUpdateSubmit}
            categories={categories}
            subcategories={subcategories}
        />
    </div>
    );
}
