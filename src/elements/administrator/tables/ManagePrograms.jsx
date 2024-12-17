import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AdminNavigation from '../../../pages/administrator/AdminNavigation';
import AdminInfo from '../../../pages/administrator/AdminInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';

import AddProgramModal from '../../../elements/administrator/modals/AddProgramModal';
import EditProgramModal from '../../../elements/administrator/modals/EditProgramModal';
import folderBackground from '../../../components/images/folder_background.png';

export default function ManagePrograms() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProgramModal, setShowProgramModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [programFormData, setProgramFormData] = useState({
        program_code: '',
        program_name: '',
        department_id: '',
        department_name: '',
        status: '',
    });
    const [editProgramId, setEditProgramId] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [programsPerPage] = useState(10);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');
        if (!token || roleId !== '1') {
            navigate('/unauthorized');
        } else {
            fetchDepartments(); 
        }
    }, [navigate]);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:9000/programs', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setPrograms(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch programs');
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:9000/departments', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch departments');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCreateNewProgram = () => {
        setShowProgramModal(true);
    };

    const handleCloseProgramModal = () => {
        setShowProgramModal(false);
        setProgramFormData({
            program_code: '',
            program_name: '',
            department_id: '',
            status: '',
        });
    };

    const handleProgramChange = (e) => {
        const { name, value } = e.target;
        setProgramFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProgramSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register-program', programFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Program Added Successfully!',
                text: 'The new program has been added successfully.',
            });
            handleCloseProgramModal();
            fetchPrograms();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while adding the program. Please try again later!',
            });
        }
    };

    const handleEditProgram = (id) => {
        const program = programs.find(prog => prog.program_id === id);
        if (program) {
            setProgramFormData({
                program_code: program.program_code,
                program_name: program.program_name,
                department_id: program.department_id,
                status: program.status,
            });
            setEditProgramId(id);
            setShowEditModal(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/program/${editProgramId}`, programFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Program Updated Successfully!',
                text: 'The program has been updated successfully.',
            });
            setShowEditModal(false);
            fetchPrograms();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while updating the program. Please try again later!',
            });
        }
    };

    const handleDeleteProgram = (id) => {
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
                    await axios.delete(`http://localhost:9000/program/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The program has been deleted.',
                        'success'
                    );
                    fetchPrograms();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while deleting the program. Please try again later!',
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

    // Pagination logic
    const indexOfLastProgram = currentPage * programsPerPage;
    const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
    const currentPrograms = programs.slice(indexOfFirstProgram, indexOfLastProgram);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(programs.length / programsPerPage);

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
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    
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
                        Manage Programs
                    </h6>
                </div>

                {/* Search and Add Button */}
                <div style={{  marginLeft: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '850px' }}><SearchAndFilter /></div>
                    <button
                        onClick={handleCreateNewProgram}
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
                        Add Program
                        <FaPlus style={{ marginLeft: '10px' }} />
                    </button>
                </div>

                {/* Program Table */}
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
                            <th style={{ width: '5%'}}>No.</th>
                            <th style={{ width: '10%' }}>Code</th>
                            <th>Program Name</th>
                            <th style={{ width: '25%' }}>Department</th>
                            <th style={{ width: '13%' }}>Status</th>
                            <th style={{width: '10%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPrograms.map((program, index) => (
                            <tr key={program.program_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                                <td style={{ textAlign: 'center' }}>{ (currentPage - 1) * programsPerPage + (index + 1) }</td>
                                <td>{program.program_code}</td>
                                <td>{program.program_name}</td>
                                <td>{program.department_name}</td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(program.status)}</td>
                                <td style={{ textAlign: 'center' }}>
                                        <EditIcon
                                            onClick={() => handleEditProgram(program.program_id)}
                                            style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                                        />
                                        <DeleteIcon
                                            onClick={() => handleDeleteProgram(program.program_id)}
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
            
            {/* Add Program Modal */}
            <AddProgramModal 
                show={showProgramModal} 
                handleClose={handleCloseProgramModal} 
                handleSubmit={handleProgramSubmit} 
                programFormData={programFormData}
                handleChange={handleProgramChange} 
                departments={departments}
            />

            {/* Edit Program Modal */}
            <EditProgramModal 
                show={showEditModal} 
                handleClose={() => setShowEditModal(false)} 
                handleSubmit={handleEditSubmit} 
                programFormData={programFormData}
                handleChange={handleProgramChange} 
            />
        </div>
    );
}