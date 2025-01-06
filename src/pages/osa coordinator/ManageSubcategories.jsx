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
import AddSubcategoryModal from '../../elements/osa coordinator/modals/AddSubcategoryModal';
import EditSubcategoryModal from '../../elements/osa coordinator/modals/EditSubcategoryModal';
import folderBackground from '../../../src/components/images/folder_background.png';

export default function ManageSubcategories() {
    const navigate = useNavigate();
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSubcategoryId, setEditSubcategoryId] = useState(null);
    const [subcategoryFormData, setSubcategoryFormData] = useState({
        subcategory_code: '',
        subcategory_name: '',
        status: ''
    });


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [subcategoriesPerPage] = useState(10);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchSubcategories();
    }, []);

    // Fetch subcategories
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://localhost:9000/subcategories', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSubcategories(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch subcategories');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewSubcategory = () => {
        setShowSubcategoryModal(true);
    };

    const handleCloseSubcategoryModal = () => {
        setShowSubcategoryModal(false);
        setSubcategoryFormData({
            subcategory_code: '',
            subcategory_name: '',
            status: '', 
        });
    };

    const handleSubcategoryChange = (e) => {
        const { name, value } = e.target;
        setSubcategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    // Handle the create subcategory
    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/create-subcategory', subcategoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Subcategory Added Successfully!',
                text: 'The new subcategory has been added successfully.',
            });
            handleCloseSubcategoryModal();
            fetchSubcategories();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the subcategory. Please try again later!',
            });
        }
    };


     // Handle the edit subcategory
    const handleEditSubcategory = (id) => {
        const subcategory = subcategories.find(sub => sub.subcategory_id === id);
        if (subcategory) {
            setSubcategoryFormData({
                subcategory_code: subcategory.subcategory_code,
                subcategory_name: subcategory.subcategory_name,
                status: subcategory.status
            });
            setEditSubcategoryId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/subcategory/${editSubcategoryId}`, subcategoryFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Subcategory Updated Successfully!',
                text: 'The subcategory has been updated successfully.',
            });
            setShowEditModal(false);
            fetchSubcategories();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the subcategory. Please try again later!',
            });
        }
    };


     // Handle the delete subcategory
    const handleDeleteSubcategory = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this subcategory?',
            text: "Deleting this subcategory will also affect all associated data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/subcategory/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The subcategory has been deleted.',
                        'success'
                    );
                    fetchSubcategories();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the subcategory. Please try again later!',
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
    const indexOfLastSubcategory = currentPage * subcategoriesPerPage;
    const indexOfFirstSubcategory = indexOfLastSubcategory - subcategoriesPerPage;
    const currentSubcategories = subcategories.slice(indexOfFirstSubcategory, indexOfLastSubcategory);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(subcategories.length / subcategoriesPerPage);

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
                    Manage Subcategories
                </h6>
            </div>

            {/* Search and Add Button */}
            <div style={{  marginTop: '10px', marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '850px' }}><SearchAndFilter /></div>
                <button
                    onClick={handleCreateNewSubcategory}
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
                    Add Subcategory
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Subcategory Table */}
            <div style={{ width: '90%', marginBottom: '40px' }}>
                <table className="table table-hover table-bordered" style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                        <th style={{ width: '4%' }}>No.</th>
                            <th style={{ width: '14%' }}>Subcategory Code</th>
                            <th style={{ width: '37%' }}>Subcategory Name</th>
                            <th style={{ width: '13%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSubcategories.map((subcategory, index) => (
                            <tr key={subcategory.subcategory_id}>
                                <td style={{ textAlign: 'center' }}>{ (currentPage - 1) * subcategoriesPerPage + (index + 1) }</td>
                                <td>{subcategory.subcategory_code}</td>
                                <td>{subcategory.subcategory_name}</td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(subcategory.status)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <EditIcon 
                                        onClick={() => handleEditSubcategory(subcategory.subcategory_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteSubcategory(subcategory.subcategory_id)} 
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

                    {/* Previous Page Button */}
                    <button
                        onClick={() => handlePaginationChange(currentPage - 1)}
                        style={{
                            ...buttonStyle,
                            borderTopLeftRadius: '8px',  
                            borderBottomLeftRadius: '8px',
                            ...(currentPage === 1 ? disabledButtonStyle : {}),
                        }}
                        disabled={currentPage === 1}
                    >
                        ❮
                    </button>

                    {/* Page Numbers */}
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

                    {/* Next Page Button */}
                    <button
                        onClick={() => handlePaginationChange(currentPage + 1)}
                        style={{
                            ...buttonStyle,
                            borderTopRightRadius: '8px',  
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


            {/* Add Subcategory Modal */}
            <AddSubcategoryModal
                show={showSubcategoryModal}
                handleClose={handleCloseSubcategoryModal}
                subcategoryFormData={subcategoryFormData}
                handleSubcategoryChange={handleSubcategoryChange}
                handleSubcategorySubmit={handleSubcategorySubmit}
            />

            {/* Edit Subcategory Modal */}
            <EditSubcategoryModal 
                show={showEditModal} 
                handleClose={() => setShowEditModal(false)} 
                handleSubmit={handleEditSubmit} 
                subcategoryFormData={subcategoryFormData}
                handleSubcategoryChange={handleSubcategoryChange}
            />
        </div>
    );
}
