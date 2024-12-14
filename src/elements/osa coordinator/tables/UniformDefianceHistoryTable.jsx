import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import ViewHistoryModal from '../modals/ViewHistoryModal';

const UniformDefianceHistoryTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false); 
    const [showModal, setShowModal] = useState(false); 
    const [selectedRecord, setSelectedRecord] = useState(null); 
    const [employeeNames, setEmployeeNames] = useState({});
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchEmployeeName = useCallback(async (employee_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/employees/${employee_idnumber}`, { headers });
            const name = response.data.name;
            setEmployeeNames(prevNames => ({ ...prevNames, [employee_idnumber]: name }));
        } catch (error) {
            console.error('Error fetching employee name:', error);
        }
    }, [headers]);

    const fetchDefiances = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });

                const fuse = new Fuse(response.data, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'photo_video_filename', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4,
                });

                const searchResults = fuse.search(searchQuery);

                const filteredDefiances = searchResults
                    .map(result => result.item)
                    .filter(defiance => defiance.status !== 'Pending');

                setDefiances(filteredDefiances);

                const employeeIds = new Set(filteredDefiances.map(defiance => defiance.submitted_by));
                employeeIds.forEach(id => {
                    if (!employeeNames[id]) {
                        fetchEmployeeName(id);
                    }
                });
            } else {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
                const nonPendingDefiances = response.data.filter(defiance => defiance.status !== 'Pending');
                setDefiances(nonPendingDefiances);

                const employeeIds = new Set(nonPendingDefiances.map(defiance => defiance.submitted_by));
                employeeIds.forEach(id => {
                    if (!employeeNames[id]) {
                        fetchEmployeeName(id);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching defiances:', error);
        }
    }, [headers, searchQuery, fetchEmployeeName, employeeNames]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

    const handleRedirect = async (slip_id) => {
        try {
            const response = await axios.get(`http://localhost:9000/uniform_defiance/${slip_id}`);
            const defiance = response.data;
            localStorage.setItem('selectedDefiance', JSON.stringify(defiance)); 
            navigate(`/individualdefiancerecord/${slip_id}`);
        } catch (error) {
            console.error('Error fetching defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while fetching defiance data. Please try again later.',
            });
        }
    };

    const deleteDefiance = async (slipId) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });
        if (!isConfirm) {
            return;
        }

        try {
            await axios.delete(`http://localhost:9000/uniform_defiance/${slipId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: 'Defiance has been deleted.',
            });
            setDefiances(prevDefiances => prevDefiances.filter(defiance => defiance.slip_id !== slipId));
        } catch (error) {
            console.error('Error deleting defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting defiance. Please try again later.',
            });
        }
    };

    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const handleCloseDetailsModal = () => {
        setSelectedRecord(null);
        setShowModal(false);
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <>
            <div className='container'>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th>Date Submitted</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Nature of Violation</th>
                            <th>Details</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defiances.map((defiance, index) => (
                            <tr key={index}>
                                <td>{defiance.slip_id}</td>
                                <td>{defiance.created_at}</td>
                                <td>
                                    <Link 
                                        to={`/individualuniformdefiance/${defiance.student_idnumber}`}
                                        style={{ textDecoration: 'underline', color: 'black' }}
                                    >
                                        {defiance.student_idnumber}
                                    </Link>
                                </td>
                                <td>{defiance.nature_name}</td>
                                <td>
                                    <span 
                                        onClick={() => handleShowDetailsModal(defiance)} 
                                        style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                                    >
                                        View
                                    </span>
                                </td>
                                <td>{defiance.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Use the imported ViewHistoryModal instead of inline modal */}
            <ViewHistoryModal 
                show={showModal} 
                onHide={handleCloseDetailsModal} 
                selectedRecord={selectedRecord} 
            />
        </>
    );
};

export default UniformDefianceHistoryTable;
