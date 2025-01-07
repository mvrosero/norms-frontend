import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

import ViewRecordModal from '../modals/ViewRecordModal';

const MyRecordsTable = () => {
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

        // Log sanction names for debugging
        console.log('Sanction Names:', sanctionNames);

        return sanctionNames.every(name => name === 'Unknown') ? 'Unknown' : sanctionNames.join(', ');
    };

    const getSanctionName = (sanction_id) => {
        sanction_id = String(sanction_id);
        const sanction = sanctions.find(sanction => String(sanction.sanction_id) === sanction_id);
        return sanction ? sanction.sanction_name : 'Unknown';
    };

    // Function to get academic year name by ID in "start_year - end_year" format
    const getAcademicYearName = (acadyear_id) => {
        const academicYear = academicYears.find(year => year.acadyear_id === acadyear_id);
        return academicYear ? `${academicYear.start_year} - ${academicYear.end_year}` : 'Unknown';
    };

    // Function to get semester name by ID
    const getSemesterName = (semester_id) => {
        const semester = semesters.find(sem => sem.semester_id === semester_id);
        return semester ? semester.semester_name : 'Unknown';
    };

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
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

    return (
        <>
            {loading && <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <>
                    <Table bordered hover style={{ marginTop: '30px', marginBottom: '50px', marginLeft: '105px', borderRadius: '20px' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th style={{ width: '5%' }}>ID</th>
                                <th style={{ width: '20%' }}>Date</th>
                                <th style={{ width: '13%' }}>Category</th>
                                <th>Offense</th>
                                <th style={{ width: '15%' }}>Sanction</th>
                                <th style={{ width: '15%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.record_id}>
                                    <td style={{ textAlign: 'center' }}>{record.record_id}</td>
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

                    {/* Modal to display record details */}
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
                </>
            )}
        </>
    );
};

export default MyRecordsTable;
