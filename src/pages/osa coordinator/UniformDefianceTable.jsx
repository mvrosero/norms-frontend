import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js'; // Import fuse.js


const UniformDefianceTable = ({ searchQuery }) => {
    const [defiances, setDefiances] = useState([]);
    const [deletionStatus, setDeletionStatus] = useState(false); // State to track deletion status
    const navigate = useNavigate();

    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    const fetchDefiances = useCallback(async () => {
        try {
            let response;
            if (searchQuery) {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });

                // Create a new instance of Fuse with the defiances data and search options
                const fuse = new Fuse(response.data, {
                    keys: ['defiance_id', 'student_idnumber', 'violation_date', 'remarks'],
                    includeScore: true,
                    threshold: 0.4, // Adjust threshold as needed
                });

                // Perform fuzzy search
                const searchResults = fuse.search(searchQuery);

                // Extract the item from search results
                const filteredDefiances = searchResults.map(result => result.item);

                setDefiances(filteredDefiances);
            } else {
                response = await axios.get('http://localhost:9000/uniform_defiances', { headers });
                setDefiances(response.data);
            }
        } catch (error) {
            console.error('Error fetching defiances:', error);
        }
    }, [headers, searchQuery]);

    useEffect(() => {
        fetchDefiances();
    }, [fetchDefiances]);

    const handleRedirect = async (defiance_id) => {
        try {
            const response = await axios.get(`http://localhost:9000/uniform_defiance/${defiance_id}`);
            const defiance = response.data;
            localStorage.setItem('selectedDefiance', JSON.stringify(defiance)); // Store selected defiance data in localStorage
            navigate(`/individualdefiancerecord/${defiance_id}`);
        } catch (error) {
            console.error('Error fetching defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while fetching defiance data. Please try again later.',
            });
        }
    };

    const deleteDefiance = async (defianceId) => {
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
            await axios.delete(`http://localhost:9000/uniform_defiance/${defianceId}`, { headers });
            Swal.fire({
                icon: 'success',
                text: "Successfully Deleted"
            });
            setDeletionStatus(prevStatus => !prevStatus); // Toggle deletionStatus to trigger re-fetch
            // Update the defiances state by removing the deleted defiance
            setDefiances(prevDefiances => prevDefiances.filter(defiance => defiance.defiance_id !== defianceId));
        } catch (error) {
            console.error('Error deleting defiance:', error);
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while deleting defiance. Please try again later.',
            });
        }
    };

    return (
        <>
            <div className='container'>
                <br />
                <div className='col-12'>
                </div>

                {/*defiance table*/}
                <Table bordered hover style={{ borderRadius: '20px', marginLeft: '110px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}> {/* Setting header background color */}
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '10%' }}>ID Number</th>
                            <th>Violation Date</th>
                            <th>Remarks</th>
                            <th style={{ width: '10%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defiances.map((defiance, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{defiance.defiance_id}</td>
                                <td>{defiance.student_idnumber}</td>
                                <td>{defiance.violation_date}</td>
                                <td>{defiance.remarks}</td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Button className='btn btn-secondary btn-md ms-2' onClick={() => handleRedirect(defiance.defiance_id)}>
                                            <PersonIcon />
                                        </Button>
                                        <Button className='btn btn-danger btn-md ms-2' onClick={() => deleteDefiance(defiance.defiance_id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>
        </>
    );
}

export default UniformDefianceTable;
