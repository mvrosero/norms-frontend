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
import AddViolationNatureModal from '../../elements/osa coordinator/modals/AddViolationNatureModal';
import EditViolationNatureModal from '../../elements/osa coordinator/modals/EditViolationNatureModal';
import folderBackground from '../../../src/components/images/folder_background.png';

export default function ManageViolationNature() {
    const navigate = useNavigate();
    const [natures, setNatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNatureModal, setShowNatureModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editNatureId, setEditNatureId] = useState(null);
    const [natureFormData, setNatureFormData] = useState({
        nature_code: '',
        nature_name: '',
        status: '' 
    });


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [naturesPerPage] = useState(10);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '2') {
            navigate('/unauthorized');
        }
    }, [navigate]);

    useEffect(() => {
        fetchNatures();
    }, []);

    // Fetch nature of violations
    const fetchNatures = async () => {
        try {
            const response = await axios.get('http://localhost:9000/violation-natures', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setNatures(response.data); // Changed to setNatures
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch violation natures');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewNature = () => {
        setShowNatureModal(true);
    };

    const handleCloseNatureModal = () => {
        setShowNatureModal(false);
        resetFormData(); 
    };

    const resetFormData = () => {
        setNatureFormData({
            nature_code: '',
            nature_name: '',
            status: '' 
        });
    };

    const handleNatureChange = (e) => {
        const { name, value } = e.target;
        setNatureFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    // Handle the create nature of violation
    const handleNatureSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/create-violationnature', natureFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Violation nature Added Successfully!',
                text: 'The new violation nature has been added successfully.',
            });
            handleCloseNatureModal();
            fetchNatures();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the violation nature. Please try again later!',
            });
        }
    };


    // Handle the edit nature of violation
    const handleEditNature = (id) => {
        const violation_nature = natures.find(sub => sub.nature_id === id);
        if (violation_nature) {
            setNatureFormData({
                nature_code: violation_nature.nature_code,
                nature_name: violation_nature.nature_name,
                status: violation_nature.status
            });
            setEditNatureId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/violation-nature/${editNatureId}`, natureFormData, { // Changed to natureFormData
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Nature of Violation Updated Successfully!',
                text: 'The violation nature has been updated successfully.',
            });
            setShowEditModal(false);
            fetchNatures();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the violation nature. Please try again later!',
            });
        }
    };


    // Handle the delete nature of violation
    const handleDeleteNature = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this nature of violation?',
            text: "Deleting this nature of violation will also affect all associated data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B0B0B0',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/violation-nature/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Deleted!', 'The violation nature has been deleted.', 'success');
                    fetchNatures();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the violation nature. Please try again later!',
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
    const indexOfLastNature = currentPage * naturesPerPage;
    const indexOfFirstNature = indexOfLastNature - naturesPerPage;
    const currentNatures = natures.slice(indexOfFirstNature, indexOfLastNature);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(natures.length / naturesPerPage);

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
                <h6 className="settings-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '90px' }}>
                    Manage Nature of Violations
                </h6>
            </div>

            {/* Search and Add Button */}
            <div style={{  marginTop: '10px', marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '850px' }}><SearchAndFilter /></div>
                <button
                    onClick={handleCreateNewNature}
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
                    Add Violation Nature
                    <FaPlus style={{ marginLeft: '10px' }} />
                </button>
            </div>

            {/* Nature of Violation Table */}
            <div style={{ width: '90%', marginBottom: '40px' }}>
                <table className="table table-hover table-bordered" style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                        <th style={{ width: '4%' }}>No.</th>
                            <th style={{ width: '20%' }}>Violation Nature Code</th>
                            <th style={{ width: '37%' }}>Violation Nature Name</th>
                            <th style={{ width: '13%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentNatures.map((nature, index) => (
                            <tr key={nature.nature_id}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ textAlign: 'center' }}>{nature.nature_code}</td>
                                <td>{nature.nature_name}</td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(nature.status)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <EditIcon 
                                        onClick={() => handleEditNature(nature.nature_id)} 
                                        style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                                    />
                                    <DeleteIcon 
                                        onClick={() => handleDeleteNature(nature.nature_id)} 
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

            {/* Add Violation Nature Modal */}
            <AddViolationNatureModal 
                show={showNatureModal} 
                handleClose={() => setShowNatureModal(false)} 
                handleNatureSubmit={handleNatureSubmit} 
                natureFormData={natureFormData} 
                handleNatureChange={handleNatureChange} 
            />

            {/* Edit Violation Nature Modal */}
            <EditViolationNatureModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                handleNatureSubmit={handleEditSubmit}
                natureFormData={natureFormData}
                handleNatureChange={handleNatureChange}
            />
        </div>
    );
}
