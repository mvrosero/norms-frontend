import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const IndividualUniformDefianceTable = ({ handleShowDetailsModal }) => {
    const [defiances, setDefiances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Sorting states
    const [sortOrderSlipId, setSortOrderSlipId] = useState('asc'); // 'asc' for ascending, 'desc' for descending
    const [sortOrderDate, setSortOrderDate] = useState('asc'); // 'asc' for ascending, 'desc' for descending

    useEffect(() => {
        const fetchDefiances = async () => {
            try {
                const response = await fetch('http://localhost:9000/uniform_defiances');
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

        fetchDefiances();
    }, []);

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
            const dateA = new Date(a.updated_at); // Convert to Date object for comparison
            const dateB = new Date(b.updated_at);

            // Compare dates including time
            return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setDefiances(sortedDefiances);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
    };

    // Calculate paginated defiances
    const indexOfLastDefiance = currentPage * rowsPerPage;
    const indexOfFirstDefiance = indexOfLastDefiance - rowsPerPage;
    const currentDefiances = approvedDefiances.slice(indexOfFirstDefiance, indexOfLastDefiance);

    const totalPages = Math.ceil(approvedDefiances.length / rowsPerPage);

    // Handle pagination change
    const handlePaginationChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render Table
    const renderTable = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (approvedDefiances.length === 0) {
            return <div>No data available.</div>;
        }

        return (
            <Table bordered hover style={{ borderRadius: '20px', marginTop: '5px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '5%' }}>
                            <button
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
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
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
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
                        <th style={{ width: '8%' }}>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDefiances.map((defiance, index) => {
                        // Get count based on the sorting order of the date
                        const count = sortOrderDate === 'asc' 
                            ? currentDefiances.length - index  // Reverse order for ascending (9-1)
                            : index + 1;  // Normal order for descending (1-9)

                        // Determine background color based on the count
                        let countColor, countTextColor;
                        if (count === 1) {
                            countColor = '#FFF9C4'; // Light yellow
                            countTextColor = '#FBC02D'; // Darker yellow
                        } else if (count === 2) {
                            countColor = '#FFECB3'; // Light orange
                            countTextColor = '#FF5722'; // Darker orange
                        } else {
                            countColor = '#FFCDD2'; // Light red
                            countTextColor = '#D32F2F'; // Darker red
                        }

                        return (
                            <tr key={defiance.slip_id}>
                                <td style={{ textAlign: 'center' }}>{defiance.slip_id}</td>
                                <td>{new Date(defiance.updated_at).toLocaleString()}</td>
                                <td>{defiance.nature_name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div
                                        onClick={() => handleShowDetailsModal(defiance)}
                                        style={{ cursor: 'pointer', color: '#000000', textDecoration: 'underline', fontWeight: 'bold' }}
                                    >
                                        View
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>{renderStatus(defiance.status)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            backgroundColor: countColor,
                                            color: countTextColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            margin: '0 auto'
                                        }}
                                    >
                                        {count}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    };

    
  // Render Custom Pagination
 const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    const buttonStyle = {
      width: '30px', // Fixed width for equal size
      height: '30px', // Fixed height for equal size
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #a0a0a0',
      backgroundColor: '#ebebeb',
      color: '#4a4a4a',
      fontSize: '0.75rem', // Smaller font size
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '15px',
        }}
      >
        {/* Page Info */}
        <div style={{ fontSize: '0.875rem', color: '#4a4a4a', marginRight: '10px' }}>
          Page {currentPage} out of {totalPages}
        </div>
  
        {/* Pagination Buttons */}
        <div style={{ display: 'flex', marginRight: '20px' }}>
          <button
            onClick={() => currentPage > 1 && handlePaginationChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...buttonStyle,
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              ...(currentPage === 1 && disabledButtonStyle),
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
            onClick={() => currentPage < totalPages && handlePaginationChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              ...buttonStyle,
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              ...(currentPage === totalPages && disabledButtonStyle),
            }}
          >
            ❯
          </button>
        </div>
      </div>
    );
  };

    return (
        <div>
            {renderTable()}
            {renderPagination()}
        </div>
    );
};

export default IndividualUniformDefianceTable;
