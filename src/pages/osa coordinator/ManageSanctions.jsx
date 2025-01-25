import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CoordinatorNavigation from './CoordinatorNavigation';
import CoordinatorInfo from './CoordinatorInfo';
import SFforSettingsTable from '../../elements/general/searchandfilters/SFforSettingsTable';
import AddSanctionModal from '../../elements/osa coordinator/modals/AddSanctionModal';
import EditSanctionModal from '../../elements/osa coordinator/modals/EditSanctionModal';
import folderBackground from '../../../src/components/images/folder_background.png';

export default function ManageSanctions() {
    const [sanctions, setSanctions] = useState([]);
    const [filteredSanctions, setFilteredSanctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSanctionModal, setShowSanctionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSanctionId, setEditSanctionId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sanctionFormData, setSanctionFormData] = useState({
        sanction_code: '',
        sanction_name: '',
        status: ''
    });
    const [allItems, setAllItems] = useState([]);  
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const navigate = useNavigate();


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [sanctionsPerPage] = useState(10);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    
    // Fetch sanctions
    const fetchSanctions = async () => {
        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/sanctions', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            setSanctions(response.data);
            setAllItems(response.data);  
            setFilteredSanctions(response.data); 
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch sanctions');
        } finally {
            setLoading(false);
        }
    };

       
    // Handle search query changes
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Handle filter changes (status)
    const handleFilterChange = (filters) => {
        console.log('Updated Filters:', filters);
        setFilters(filters);
    };

    // Apply search query and filters to sanctions
    useEffect(() => {
        const filtered = allItems.filter(sanction => {
            const normalizedQuery = searchQuery.toLowerCase();
            const matchesQuery = 
                sanction.sanction_code.toLowerCase().includes(normalizedQuery) ||
                sanction.sanction_name.toLowerCase().includes(normalizedQuery);

            const matchesStatus = filters.status ? sanction.status === filters.status : true;

            return matchesQuery && matchesStatus;
        });
        setFilteredSanctions(filtered);
    }, [searchQuery, filters, allItems]);
    useEffect(() => {
        fetchSanctions();
    }, []);


    
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


    // Handle the create sanction
    const handleSanctionSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://test-backend-api-2.onrender.com/register-sanction', sanctionFormData, {
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


     // Handle the edit sanction
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
        setIsSubmitting(true);
        try {
            await axios.put(`https://test-backend-api-2.onrender.com/sanction/${editSanctionId}`, sanctionFormData, {
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


     // Handle the delete sanction
    const handleDeleteSanction = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this sanction?',
            text: "Deleting this sanction will also affect all associated data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://test-backend-api-2.onrender.com/sanction/${id}`, {
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
    const indexOfLastSanction = currentPage * sanctionsPerPage;
    const indexOfFirstSanction = indexOfLastSanction - sanctionsPerPage;
    const currentSanctions = filteredSanctions.slice(indexOfFirstSanction, indexOfLastSanction);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredSanctions.length / sanctionsPerPage);


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
                    Manage Sanctions
                </h6>
            </div>

            {/* Search and Add Button */}
            <div style={{  marginTop: '10px', marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '850px' }}><SFforSettingsTable onSearch={handleSearch} onFilterChange={handleFilterChange}/></div>
                <button
                    onClick={handleCreateNewSanction}
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
                    Add Sanction
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Sanction Table */}
            <div style={{ width: '90%', marginBottom: '40px' }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <div style={{ width: "50px", height: "50px", border: "6px solid #f3f3f3", borderTop: "6px solid #a9a9a9", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                    <style> {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`} </style>
                    </div>
                ) : (
            <>
                <table className="table table-hover table-bordered" style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '4%' }}>No.</th>
                            <th style={{ width: '14%' }}>Sanction Code</th>
                            <th style={{ width: '37%' }}>Sanction Name</th>
                            <th style={{ width: '13%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSanctions.length > 0 ? (
                            currentSanctions.map((sanction, index) => (
                            <tr key={sanction.sanction_id}>
                                <td style={{ textAlign: 'center' }}>{ (currentPage - 1) * sanctionsPerPage + (index + 1) }</td>
                                <td>{sanction.sanction_code}</td>
                                <td>{sanction.sanction_name}</td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(sanction.status)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <EditIcon 
                                        onClick={() => handleEditSanction(sanction.sanction_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteSanction(sanction.sanction_id)} 
                                        style={{ cursor: 'pointer', color: '#dc3545' }}
                                    />
                                </td>
                            </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No sanctions found</td>
                                </tr>
                            )}
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
                    </>
                )}
                </div>
            </div>

            {/* Add Sanction Modal */}
            <AddSanctionModal 
                show={showSanctionModal} 
                handleClose={handleCloseSanctionModal}
                sanctionFormData={sanctionFormData} 
                handleSanctionChange={handleSanctionChange}
                handleSanctionSubmit={handleSanctionSubmit}
            />

            {/* Edit Sanction Modal */}
            <EditSanctionModal 
                show={showEditModal} 
                handleClose={() => setShowEditModal(false)} 
                handleSubmit={handleEditSubmit} 
                sanctionFormData={sanctionFormData} 
                handleSanctionChange={handleSanctionChange} 
            />
        </div>
    );
}
