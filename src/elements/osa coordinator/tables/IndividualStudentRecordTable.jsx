import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import styled from '@emotion/styled';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewViolationModal from '../modals/ViewViolationModal';

const IndividualStudentRecordTable = () => {
    const { student_idnumber } = useParams();
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting state for date
    const [sortOrderDate, setSortOrderDate] = useState('asc'); 


    // Fetch the violation records
    useEffect(() => {
        const fetchData = async () => {
            try {
                const violationResponse = await axios.get(
                    `https://test-backend-api-2.onrender.com/individual_violationrecords/${student_idnumber}`
                );
                setRecords(violationResponse.data);

                const [categoriesResponse, offensesResponse, sanctionsResponse, academicYearsResponse, semestersResponse] =
                    await Promise.all([
                        axios.get('https://test-backend-api-2.onrender.com/categories'),
                        axios.get('https://test-backend-api-2.onrender.com/offenses'),
                        axios.get('https://test-backend-api-2.onrender.com/sanctions'),
                        axios.get('https://test-backend-api-2.onrender.com/academic_years'),
                        axios.get('https://test-backend-api-2.onrender.com/semesters'),
                    ]);
                setCategories(categoriesResponse.data);
                setOffenses(offensesResponse.data);
                setSanctions(sanctionsResponse.data);
                setAcademicYears(academicYearsResponse.data);
                setSemesters(semestersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [student_idnumber]);


    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };


    // Styles for the view button
    const ViewButton = styled.button`
        border-radius: 20px;
        background: linear-gradient(45deg, #015901, #006637, #4aa616);
        color: white;
        border: none;
        padding: 5px 30px;
        cursor: pointer;
        &:hover {
            background: linear-gradient(45deg, #4aa616, #006637, #015901);
        }
    `;


    // Sort users based on date
    const handleSortDate = () => {
        const sortedRecords = [...records];
        sortedRecords.sort((a, b) => {
            const dateA = new Date(a.created_at); 
            const dateB = new Date(b.created_at);

            return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setRecords(sortedRecords);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
    };


    // Pagination Logic
    const indexOfLastRecord = currentPage * rowsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(records.length / rowsPerPage);

    const handlePaginationChange = (pageNumber) => setCurrentPage(pageNumber);
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
                    style={{ fontSize: '14px', padding: '5px 25px', border: '1px solid #ccc', borderRadius: '3px' }} >
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((value) => (
                        <option key={value} value={value}> {value} </option> ))}
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


// Render the individual student records table
    return (
        <div style={{ paddingTop: '10px' }}>
            <Table bordered hover responsive style={{ borderRadius: '20px', marginBottom: '20px', marginLeft: '110px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                        <th style={{ width: '5%'}}>No.</th>
                        <th style={{ textAlign: 'center', padding: '0', verticalAlign: 'middle', width: '20%' }}>
                            <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
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
                        <th style={{ width: '12%' }}>Category</th>
                        <th>Offense</th>
                        <th style={{ width: '13%' }}>Academic Year</th>
                        <th style={{ width: '13%' }}>Semester</th>
                        <th style={{ width: '12%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((record, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{ (currentPage - 1) * rowsPerPage + (index + 1) }</td>
                            <td>{new Date(record.created_at).toLocaleString()}</td>
                            <td>{record.category_name}</td>
                            <td>{record.offense_name}</td>
                            <td style={{ textAlign: 'center' }}>{`${record.start_year} - ${record.end_year}`}</td>
                            <td style={{ textAlign: 'center' }}>{record.semester_name}</td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <ViewButton onClick={() => handleViewDetails(record)}>View</ViewButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {renderPagination()}

            {/*View Violation Modal*/}
            <ViewViolationModal
                show={showDetailsModal}
                onHide={handleCloseDetailsModal}
                selectedRecord={selectedRecord}
            />
        </div>
    );
};


export default IndividualStudentRecordTable;
