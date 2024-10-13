import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js';
import ViewUniformDefianceModal from '../modals/ViewUniformDefianceModal';

const UniformDefianceTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchEmployeeName = async (employee_idnumber) => {
        try {
            const response = await axios.get(`http://localhost:9000/employees/${employee_idnumber}`, { headers });
            return response.data.name;
        } catch (error) {
            console.error('Error fetching employee name:', error);
            return 'Unknown';
        }
    };

    const fetchDefiances = useCallback(async () => {
        try {
            let response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
            let data = response.data;

            // Filter data to include only those with status 'Pending'
            data = data.filter(defiance => defiance.status === 'Pending');

            // Replace submitted_by with full name
            const updatedData = await Promise.all(data.map(async (defiance) => {
                const fullName = await fetchEmployeeName(defiance.submitted_by);
                return { ...defiance, submitted_by: fullName };
            }));

            if (searchQuery) {
                const fuse = new Fuse(updatedData, {
                    keys: ['slip_id', 'student_idnumber', 'violation_nature', 'status', 'submitted_by'],
                    includeScore: true,
                    threshold: 0.4,
                });

                const searchResults = fuse.search(searchQuery);
                data = searchResults.map(result => result.item);
            } else {
                data = updatedData;
            }

            setDefiances(data);
        } catch (error) {
            console.error('Error fetching defiances:', error);
        }
    }, [headers, searchQuery]);

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

    const updateStatus = async (slipId, newStatus) => {
        try {
            await axios.put(`http://localhost:9000/uniform_defiance/${slipId}`, { status: newStatus }, { headers });
            Swal.fire({
                icon: 'success',
                text: `Successfully Updated to ${newStatus}`
            });
            setDefiances(prevDefiances => 
                prevDefiances.filter(defiance => defiance.slip_id !== slipId)
            );
        } catch (error) {
            console.error('Error updating defiance status:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while updating defiance status. Please try again later.',
            });
        }
    };

    const handleShowDetailsModal = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setSelectedRecord(null);
        setShowDetailsModal(false);
    };

    return (
        <>
            <div className='container'>
                <br />
                <div className='col-12'></div>

                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Nature of Violation</th>
                            <th>Submitted By</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{defiance.student_idnumber}</td>
                                <td>{defiance.nature_name}</td>
                                <td>{defiance.submitted_by}</td>
                                <td>
                                    <div 
                                        className="d-flex align-items-center" 
                                        style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }} 
                                        onClick={() => handleShowDetailsModal(defiance)}
                                    >
                                        View
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Button className='btn btn-success btn-md ms-2' onClick={() => updateStatus(defiance.slip_id, 'Approved')} style={{ backgroundColor: '#008000' }}>
                                            <CheckIcon />
                                        </Button>
                                        <Button className='btn btn-danger btn-md ms-2' onClick={() => updateStatus(defiance.slip_id, 'Declined')} style={{ backgroundColor: '#ff0000' }}>
                                            <CloseIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <ViewUniformDefianceModal 
                show={showDetailsModal} 
                onHide={handleCloseDetailsModal} 
                record={selectedRecord} 
            />
        </>
    );
};

export default UniformDefianceTable;
