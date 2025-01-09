import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewRecordModal from '../modals/ViewRecordModal';

const SubcategoryTable = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subcategories, setSubcategories] = useState([]); 
    const [selectedRecord, setSelectedRecord] = useState(null);


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sorting states
    const [sortOrderDate, setSortOrderDate] = useState('asc'); 


    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentIdNumber = localStorage.getItem('student_idnumber');
                if (!studentIdNumber) {
                    throw new Error('Student ID number not found in local storage');
                }

                // Fetch records
                const recordsResponse = await axios.get(`http://localhost:9000/myrecords/${studentIdNumber}`);
                setRecords(recordsResponse.data);

                // Fetch categories
                const categoriesResponse = await axios.get('http://localhost:9000/categories');
                setCategories(categoriesResponse.data);

                // Fetch offenses
                const offensesResponse = await axios.get('http://localhost:9000/offenses');
                setOffenses(offensesResponse.data);

                // Fetch sanctions
                const sanctionsResponse = await axios.get('http://localhost:9000/sanctions');
                setSanctions(sanctionsResponse.data);

                // Fetch academic years
                const academicYearsResponse = await axios.get('http://localhost:9000/academic_years');
                setAcademicYears(academicYearsResponse.data);

                // Fetch semesters
                const semestersResponse = await axios.get('http://localhost:9000/semesters');
                setSemesters(semestersResponse.data);

                // Fetch subcategories (newly added)
                const subcategoriesResponse = await axios.get('http://localhost:9000/subcategories');
                    setSubcategories(subcategoriesResponse.data);
                } catch (error) {
                    setError(error.message || 'An error occurred');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);


    const getSubcategoryName = (subcategory_id) => {
        const subcategory = subcategories.find(subcategory => subcategory.subcategory_id === subcategory_id);
        return subcategory ? subcategory.subcategory_name : 'Unknown';
    };

    const getCategoryName = (category_id) => {
        const category = categories.find(cat => cat.category_id === category_id);
        return category ? category.category_name : 'Unknown';
    };

    const getOffenseName = (offense_id) => {
        const offense = offenses.find(offense => offense.offense_id === offense_id);
        return offense ? offense.offense_name : 'Unknown';
    };

    const getSanctionNames = (sanction_ids) => {
        if (!sanction_ids) return 'Unknown';
        
        const ids = sanction_ids.split(',').map(id => id.trim());
        
        const sanctionNames = ids.map(id => getSanctionName(id));

        console.log('Sanction Names:', sanctionNames);

        return sanctionNames.every(name => name === 'Unknown') ? 'Unknown' : sanctionNames.join(', ');
    };

    const getSanctionName = (sanction_id) => {
        sanction_id = String(sanction_id);
        const sanction = sanctions.find(sanction => String(sanction.sanction_id) === sanction_id);
        return sanction ? sanction.sanction_name : 'Unknown';
    };

    const getAcademicYearName = (acadyear_id) => {
        const academicYear = academicYears.find(year => year.acadyear_id === acadyear_id);
        return academicYear ? `${academicYear.start_year} - ${academicYear.end_year}` : 'Unknown';
    };

    const getSemesterName = (semester_id) => {
        const semester = semesters.find(sem => sem.semester_id === semester_id);
        return semester ? semester.semester_name : 'Unknown';
    };


    const handleViewDetails = (record) => {
        setSelectedRecord(record);
    };


    // Sort records based on date
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




    const buttonStyles = {
        borderRadius: '20px',
        background: 'linear-gradient(45deg, #015901, #006637, #4AA616)',
        color: 'white',
        border: 'none',
        padding: '5px 30px',
        cursor: 'pointer',
        textAlign: 'center',
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

return (
    <div>
           <Table bordered hover responsive style={{ borderRadius: '20px', marginTop: '10px', marginBottom: '20px', marginLeft: '110px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '5%' }}>No.</th>
                        <th style={{ width: '20%' }}>
                            <button style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
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
                        <th style={{ width: '13%' }}>Category</th>
                        <th>Offense</th>
                        <th style={{ width: '25%' }}>Sanction</th>
                        <th style={{ width: '10%' }}>Action</th>
                    </tr>
                </thead>
                        <tbody>
                            {currentRecords.map((record, index) => (
                                <tr key={record.record_id}>
                                    <td style={{ textAlign: 'center' }}>{ (currentPage - 1) * rowsPerPage + (index + 1) }</td>
                                    <td style={{ textAlign: 'center' }}>{new Date(record.created_at).toLocaleString()}</td>
                                    <td>{getCategoryName(record.category_id)}</td>
                                    <td>{getOffenseName(record.offense_id)}</td>
                                    <td>{getSanctionNames(record.sanction_ids)}</td>
                                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button style={buttonStyles} onClick={() => handleViewDetails(record)}>
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

            {renderPagination()}

            {/* View Record Modal */}
            {selectedRecord && (
                <ViewRecordModal 
                    show={selectedRecord !== null} 
                    onHide={() => setSelectedRecord(null)} 
                    record={selectedRecord}
                    getCategoryName={getCategoryName}
                    getOffenseName={getOffenseName}
                    getSubcategoryName={getSubcategoryName}
                    getSanctionNames={getSanctionNames}
                    getAcademicYearName={getAcademicYearName} 
                    getSemesterName={getSemesterName} 
                />
            )}
       </div>
    );
};


export default SubcategoryTable;
