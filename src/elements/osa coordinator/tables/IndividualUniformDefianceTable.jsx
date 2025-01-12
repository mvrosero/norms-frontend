import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const IndividualUniformDefianceTable = ({ handleShowDetailsModal, filters, searchQuery }) => {
    const { student_idnumber } = useParams();  
    const [defiances, setDefiances] = useState([]);
    const [natures, setNatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting states
    const [sortOrderSlipId, setSortOrderSlipId] = useState('asc'); 
    const [sortOrderDate, setSortOrderDate] = useState('asc'); 


    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);


    // Fetch the uniform defiances
    useEffect(() => {
        const fetchDefiances = async () => {
            try {
                const response = await fetch(`http://localhost:9000/uniform_defiances/${student_idnumber}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setDefiances(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching defiances:", err);
            } finally {
                setLoading(false);
            }
        };

        if (student_idnumber) {
            fetchDefiances();
        }
    }, [student_idnumber]);


    // Fetch the students
    const fetchNatures = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:9000/violation-natures', { headers });
            setNatures(response.data);
        } catch (error) {
            console.error('Error fetching nature of violations:', error);
            Swal.fire('Error', 'Failed to fetch nature of violations.', 'error');
        }
    }, [headers]);





    // Set the styles for the status
    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'approved') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'rejected') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else if (status === 'pending') {
            backgroundColor = '#FFF5DC';
            textColor = '#FFC107';
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

    // Filter for active status
    const approvedDefiances = defiances.filter(defiance => defiance.status === 'approved');


    // Sort defiances based on slip_id
    const handleSortSlipId = () => {
        const sortedDefiances = [...approvedDefiances];
        sortedDefiances.sort((a, b) => {
            const slipIdA = parseInt(a.slip_id, 10);
            const slipIdB = parseInt(b.slip_id, 10);

            if (isNaN(slipIdA) || isNaN(slipIdB)) return 0;

            return sortOrderSlipId === 'asc' ? slipIdA - slipIdB : slipIdB - slipIdA;
        });
        setDefiances(sortedDefiances);
        setSortOrderSlipId(sortOrderSlipId === 'asc' ? 'desc' : 'asc');
    };

    const handleSortDate = () => {
        const sortedDefiances = [...approvedDefiances];
        sortedDefiances.sort((a, b) => {
            const dateA = new Date(a.updated_at); 
            const dateB = new Date(b.updated_at);

            return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setDefiances(sortedDefiances);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
    };


    // Pagination Logic
    const indexOfLastDefiance = currentPage * rowsPerPage;
    const indexOfFirstDefiance = indexOfLastDefiance - rowsPerPage;
    const currentDefiances = approvedDefiances.slice(indexOfFirstDefiance, indexOfLastDefiance);
    const totalPages = Math.ceil(approvedDefiances.length / rowsPerPage);

    const handlePaginationChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
    };

    const renderPagination = () => {
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
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
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: '#4a4a4a'}}>
            {/* Results per Page */}
            <div>
                <label htmlFor="rowsPerPage" style={{ marginLeft: '120px', marginRight: '5px' }}>Results per page:</label>
                <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    style={{ fontSize: '14px', padding: '5px 25px', border: '1px solid #ccc', borderRadius: '3px' }}>
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                        <option key={value} value={value}> {value} </option>
                    ))}
                </select>
            </div>
    
            {/* Pagination Info and Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
                {/* Page Info */}
                <div style={{ marginRight: '10px' }}>Page {currentPage} of {totalPages}</div>
    
                {/* Pagination Buttons */}
                <div style={{ display: 'flex' }}>
                    <button
                        onClick={() =>
                            currentPage > 1 && handlePaginationChange(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        style={{
                            ...buttonStyle,
                            borderTopLeftRadius: '10px',
                            borderBottomLeftRadius: '10px',
                            ...(currentPage === 1 ? disabledButtonStyle : {}),
                        }}
                    >
                        ❮
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePaginationChange(number)}
                            style={number === currentPage ? activeButtonStyle : buttonStyle}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            currentPage < totalPages && handlePaginationChange(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        style={{
                            ...buttonStyle,
                            borderTopRightRadius: '10px',
                            borderBottomRightRadius: '10px',
                            ...(currentPage === totalPages ? disabledButtonStyle : {}),
                        }}
                    >
                        ❯
                    </button>
                </div>
            </div>
        </div>
    );
};

// Render the individual uniform defiances table
const renderTable = () => {

    const filteredDefiances = defiances.filter(defiance => {

        const nature = defiance.nature_name.toLowerCase(); 
        const matchesSearchQuery = nature.includes(searchQuery.toLowerCase());

        const matchesFilters = Object.keys(filters).every(key => {
            if (filters[key]) {  
                if (key === 'nature' && nature !== filters[key].toLowerCase()) return false;
                if (key === 'filterDate' && new Date(defiance.created_at).getTime() !== new Date(filters[key]).getTime()) return false;
            }
            return true;
        });
        return matchesSearchQuery && matchesFilters; 
    });

    const currentDefiances = filteredDefiances.slice(indexOfFirstDefiance, indexOfLastDefiance);

    return (
        <div style={{ paddingTop: '10px' }}>
            <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '5%' }}>
                            <button
                                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                onClick={handleSortSlipId}
                            >
                                <span style={{ textAlign: 'center' }}>ID</span>
                                {sortOrderSlipId === 'asc' ? (
                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                ) : (
                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                )}
                            </button>
                        </th>
                        <th style={{ width: '23%' }}>
                            <button
                                style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                onClick={handleSortDate}
                            >
                                <span>Date</span>
                                {sortOrderDate === 'asc' ? (
                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                ) : (
                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                )}
                            </button>
                        </th>
                        <th>Nature of Violation</th>
                        <th style={{ width: '13%' }}>Details</th>
                        <th style={{ width: '16%' }}>Status</th>
                        <th style={{ width: '12%' }}>Occurrence</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDefiances?.length > 0 ? (
                        currentDefiances.map((defiance, index) => {

                            const getOrdinalWord = (num) => {
                                const ordinalWords = [
                                    "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", 
                                    "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth",
                                    "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", 
                                    "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth", "thirty-first"
                                ];
                                return ordinalWords[num - 1] || num;  
                            };

                            const count = sortOrderDate === 'asc' 
                                ? currentDefiances.length - index  
                                : index + 1; 

                            const ordinalCount = getOrdinalWord(count);

                            let countColor, countTextColor;
                            if (count === 1) {
                                countColor = '#FFF9C4';
                                countTextColor = '#DBC907'; 
                            } else if (count === 2) {
                                countColor = '#FFDCC4'; 
                                countTextColor = '#FF6700'; 
                            } else {
                                countColor = '#FFCDD2'; 
                                countTextColor = '#D32F2F'; 
                            }

                            return (
                                <tr key={defiance.slip_id}>
                                    <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                    <td>{new Date(defiance.updated_at).toLocaleString()}</td>
                                    <td>{defiance.nature_name}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div onClick={() => handleShowDetailsModal(defiance)} style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }}>
                                            View
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{renderStatus(defiance.status)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ borderRadius: '30px', padding: '5px 20px', backgroundColor: countColor, color: countTextColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', width: '80px' }}>
                                            {ordinalCount}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No uniform defiances found</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};


// Render the individual uniform defiances table
return (
    <div>
        {renderTable()}
        {renderPagination()}
    </div>
);
}


export default IndividualUniformDefianceTable;
