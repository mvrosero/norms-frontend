import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from '@emotion/styled';

const IndividualViolationRecordsTable = ({ records }) => {
    const [categories, setCategories] = useState([]);
    const [offenses, setOffenses] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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

    const getAcademicYearName = (acadyear_id) => {
        const academicYear = academicYears.find(academicYear => academicYear.acadyear_id === acadyear_id);
        if (academicYear) {
            return `${academicYear.start_year} - ${academicYear.end_year}`;
        }
        return 'Unknown';
    };

    const getSemesterName = (semester_id) => {
        const semester = semesters.find(semester => semester.semester_id === semester_id);
        return semester ? semester.semester_name : 'Unknown';
    };

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    const ViewButton = styled.button`
    border-radius: 20px;
    background: linear-gradient(45deg, #015901, #006637, #4AA616);
    color: white;
    border: none;
    padding: 5px 30px;
    cursor: pointer;
    text-align: center;
    &:hover {
        background: linear-gradient(45deg, #4AA616, #006637, #015901);
    }
`;

    return (
        <>
            <Table bordered hover style={{ borderRadius: '20px', marginBottom: '50px', marginLeft: '100px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                        <th style={{ width: '5%'}}>ID</th>
                        <th style={{ width: '12%'}}>Category</th>
                        <th>Offense</th>
                        <th style={{ width: '15%'}}>Sanction</th>
                        <th style={{ width: '14%'}}>Academic Year</th>
                        <th style={{ width: '14%'}}>Semester</th>
                        <th style={{ width: '12%'}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{record.record_id}</td>
                            <td>{getCategoryName(record.category_id)}</td>
                            <td>{getOffenseName(record.offense_id)}</td>
                            <td>{getSanctionName(record.sanction_id)}</td>
                            <td>{getAcademicYearName(record.acadyear_id)}</td>
                            <td>{getSemesterName(record.semester_id)}</td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <ViewButton onClick={() => handleViewDetails(record)} >
                                    View
                                </ViewButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Modal to display record details */}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ marginLeft: '100px' }}>RECORD DETAILS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && (
                        <div>
                            <p><strong>Record ID:</strong> {selectedRecord.record_id}</p>
                            <p><strong>Category:</strong> {getCategoryName(selectedRecord.category_id)}</p>
                            <p><strong>Offense:</strong> {getOffenseName(selectedRecord.offense_id)}</p>
                            <p><strong>Sanction:</strong> {getSanctionName(selectedRecord.sanction_id)}</p>
                            <p><strong>Academic Year:</strong> {getAcademicYearName(selectedRecord.acadyear_id)}</p>
                            <p><strong>Semester:</strong> {getSemesterName(selectedRecord.semester_id)}</p>
                            <p><strong>Description:</strong> {selectedRecord.description}</p>
                            <p><strong>Created At:</strong>{selectedRecord.created_at}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailsModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default IndividualViolationRecordsTable;
