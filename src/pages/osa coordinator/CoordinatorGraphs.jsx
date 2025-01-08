import React, { useState } from 'react';
import { Row, Button, Modal } from 'react-bootstrap'; 

import TopOffensesByDepartmentChart from "../../elements/osa coordinator/graphs/TopOffensesByDepartmentChart";
import TopViolationRecordsByDepartmentChart from "../../elements/osa coordinator/graphs/TopViolationRecordsByDepartmentChart";
import TopUniformDefiancesByDepartmentChart from "../../elements/osa coordinator/graphs/TopUniformDefiancesByDepartmentChart";
import TopViolationNaturesByDepartment from "../../elements/osa coordinator/graphs/TopViolationNaturesByDepartment";
import TopCategoriesChart from "../../elements/osa coordinator/graphs/TopCategoriesChart";
import TopSubcategoriesChart from "../../elements/osa coordinator/graphs/TopSubcategoriesChart";
import TotalViolationRecordsChart from "../../elements/osa coordinator/graphs/TotalViolationRecordsChart";
import TopViolationRecordsByYearLevel from "../../elements/osa coordinator/graphs/TopViolationRecordsByYearLevel";
import TopUniformDefiancesByStatus from "../../elements/osa coordinator/graphs/TopUniformDefiancesByStatus";

const CoordinatorGraphs = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };


  const handleApplyFilter = () => {
    // Check if both dates are selected
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
  
    // Check if endDate is greater than or equal to startDate
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be later than start date.');
      return;
    }
  
    console.log('Filter applied:', { startDate, endDate });
  };
  


  const handleOpenModal = (chart) => {
    setSelectedChart(chart);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChart(null);
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        {/* Text */}
        <text style={{ fontSize: '20px', fontWeight: '600' }}>Graphs</text>

        {/* Filter Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} style={{ padding: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '5px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="range"> — </label>
                <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} style={{ padding: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '5px' }} />
            </div>
                <button 
                    onClick={handleApplyFilter}   
                    onMouseDown={(e) => (e.target.style.backgroundColor = '#D1B020')}
                    onMouseUp={(e) => (e.target.style.backgroundColor = '#FAD32E')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#FAD32E')}
                    style={{ padding: '7px 15px', backgroundColor: '#FAD32E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                    Apply Filter
                </button>
        </div>
    </div>




      {/* First Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('offenses')}
        >
          <TopOffensesByDepartmentChart startDate={startDate} endDate={endDate}/>
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('violationRecords')}
        >
          <TopViolationRecordsByDepartmentChart startDate={startDate} endDate={endDate}/>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('uniformDefiances')}
        >
          <TopUniformDefiancesByDepartmentChart startDate={startDate} endDate={endDate}/>
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('violationNatures')}
        >
          <TopViolationNaturesByDepartment startDate={startDate} endDate={endDate}/>
        </div>
      </div>

      {/* Third Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('categories')}
        >
          <TopCategoriesChart startDate={startDate} endDate={endDate}/>
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('subcategories')}
        >
          <TopSubcategoriesChart startDate={startDate} endDate={endDate}/>
        </div>
      </div>

      {/* Fourth Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('totalViolationRecords')}
        >
          <TotalViolationRecordsChart startDate={startDate} endDate={endDate}/>
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('violationRecordsByYearLevel')}
        >
          <TopViolationRecordsByYearLevel startDate={startDate} endDate={endDate}/>
        </div>
      </div>

      {/* Fifth Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('uniformDefianceByStatus')}
        >
          <TopUniformDefiancesByStatus startDate={startDate} endDate={endDate}/>
        </div>
      </div>


      {/* Modal for displaying the clicked chart in large view */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header>
            <Button variant="link" onClick={handleCloseModal} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                ×
            </Button>
          <Modal.Title style={{ textAlign: 'center', width: '100%' }}>
            {selectedChart === 'offenses' ? 'OFFENSES BY DEPARTMENT' : 
             selectedChart === 'violationRecords' ? 'VIOLATION RECORDS BY DEPARTMENT' :
             selectedChart === 'uniformDefiances' ? 'UNIFORM DEFIANCES BY DEPARTMENT' :
             selectedChart === 'violationNatures' ? 'TOP NATURE OF VIOLATIONS' :
             selectedChart === 'categories' ? 'Top Categories' :
             selectedChart === 'subcategories' ? 'Top Subcategories' :
             selectedChart === 'totalViolationRecords' ? 'Total Violation Records' :
             selectedChart === 'violationRecordsByYearLevel' ? 'Top Violation Records By Year Level' :
             'Top Uniform Defiance By Status'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChart === 'offenses' && <TopOffensesByDepartmentChart startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'violationRecords' && <TopViolationRecordsByDepartmentChart startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'uniformDefiances' && <TopUniformDefiancesByDepartmentChart startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'violationNatures' && <TopViolationNaturesByDepartment startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'categories' && <TopCategoriesChart startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'subcategories' && <TopSubcategoriesChart startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'totalViolationRecords' && <TotalViolationRecordsChart startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'violationRecordsByYearLevel' && <TopViolationRecordsByYearLevel startDate={startDate} endDate={endDate}/>}
          {selectedChart === 'uniformDefianceByStatus' && <TopUniformDefiancesByStatus startDate={startDate} endDate={endDate}/>}
        </Modal.Body>
      </Modal>
    </div>
  );
};


export default CoordinatorGraphs;
