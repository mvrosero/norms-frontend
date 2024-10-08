import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

const MyRecordsTable = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subcategories, setSubcategories] = useState([]); // New state for subcategories
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
        const subcategory = subcategories.find(subcat => subcat.subcategory_id === subcategory_id);
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

    const getSanctionName = (sanction_id) => {
        const sanction = sanctions.find(sanction => sanction.sanction_id === sanction_id);
        return sanction ? sanction.sanction_name : 'Unknown';
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
                                <th style={{ width: '20%' }}>Created At</th>
                                <th style={{ width: '13%' }}>Category</th>
                                <th>Offense Name</th>
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
                                    <td>{getSanctionName(record.sanction_id)}</td>
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
                        <Modal show={selectedRecord !== null} onHide={() => setSelectedRecord(null)}>
                            <Modal.Header closeButton>
                                <Modal.Title style={{ marginLeft: '100px' }}>RECORD DETAILS</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p><strong>Record ID:</strong> {selectedRecord.record_id}</p>
                                <p><strong>Category:</strong> {getCategoryName(selectedRecord.category_id)}</p>
                                <p><strong>Offense:</strong> {getOffenseName(selectedRecord.offense_id)}</p>
                                <p><strong>Subcategory:</strong> {getSubcategoryName(selectedRecord.subcategory_id)}</p> 
                                <p><strong>Sanction:</strong> {getSanctionName(selectedRecord.sanction_id)}</p>
                                <p><strong>Academic Year:</strong> {selectedRecord.acadyear_id}</p>
                                <p><strong>Semester:</strong> {selectedRecord.semester_id}</p>
                                <p><strong>Description:</strong> {selectedRecord.description}</p>
                                <p><strong>Created At:</strong> {selectedRecord.created_at}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setSelectedRecord(null)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </>
            )}
        </>
    );
};

export default MyRecordsTable;
