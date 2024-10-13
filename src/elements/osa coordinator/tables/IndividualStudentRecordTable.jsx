// IndividualStudentRecordTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import styled from '@emotion/styled';
import ViewViolationModal from '../modals/ViewViolationModal';

const IndividualStudentRecordTable = ({ records }) => {
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
                const [categoriesResponse, offensesResponse, sanctionsResponse, academicYearsResponse, semestersResponse] = await Promise.all([
                    axios.get('http://localhost:9000/categories'),
                    axios.get('http://localhost:9000/offenses'),
                    axios.get('http://localhost:9000/sanctions'),
                    axios.get('http://localhost:9000/academic_years'),
                    axios.get('http://localhost:9000/semesters')
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
        return academicYear ? `${academicYear.start_year} - ${academicYear.end_year}` : 'Unknown';
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
                        <th style={{ width: '5%' }}>ID</th>
                        <th style={{ width: '12%' }}>Category</th>
                        <th>Offense</th>
                        <th style={{ width: '15%' }}>Sanction</th>
                        <th style={{ width: '14%' }}>Academic Year</th>
                        <th style={{ width: '14%' }}>Semester</th>
                        <th style={{ width: '12%' }}>Action</th>
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
            <ViewViolationModal
                show={showDetailsModal}
                onHide={handleCloseDetailsModal}
                selectedRecord={selectedRecord}
                getCategoryName={getCategoryName}
                getOffenseName={getOffenseName}
                getSanctionName={getSanctionName}
                getAcademicYearName={getAcademicYearName}
                getSemesterName={getSemesterName}
            />
        </>
    );
};

export default IndividualStudentRecordTable;
