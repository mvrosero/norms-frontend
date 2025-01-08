import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; 

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
      {/* First Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('offenses')}
        >
          <TopOffensesByDepartmentChart />
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('violationRecords')}
        >
          <TopViolationRecordsByDepartmentChart />
        </div>
      </div>

      {/* Second Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('uniformDefiances')}
        >
          <TopUniformDefiancesByDepartmentChart />
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('violationNatures')}
        >
          <TopViolationNaturesByDepartment />
        </div>
      </div>

      {/* Third Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('categories')}
        >
          <TopCategoriesChart />
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('subcategories')}
        >
          <TopSubcategoriesChart />
        </div>
      </div>

      {/* Fourth Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('totalViolationRecords')}
        >
          <TotalViolationRecordsChart />
        </div>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
          onClick={() => handleOpenModal('violationRecordsByYearLevel')}
        >
          <TopViolationRecordsByYearLevel />
        </div>
      </div>

      {/* Fifth Row of Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', marginRight: '20px' }}
          onClick={() => handleOpenModal('uniformDefianceByStatus')}
        >
          <TopUniformDefiancesByStatus />
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
             selectedChart === 'violationRecords' ? 'Top Violation Records By Department' :
             selectedChart === 'uniformDefiances' ? 'Top Uniform Defiances By Department' :
             selectedChart === 'violationNatures' ? 'Top Violation Natures By Department' :
             selectedChart === 'categories' ? 'Top Categories' :
             selectedChart === 'subcategories' ? 'Top Subcategories' :
             selectedChart === 'totalViolationRecords' ? 'Total Violation Records' :
             selectedChart === 'violationRecordsByYearLevel' ? 'Top Violation Records By Year Level' :
             'Top Uniform Defiance By Status'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChart === 'offenses' && <TopOffensesByDepartmentChart />}
          {selectedChart === 'violationRecords' && <TopViolationRecordsByDepartmentChart />}
          {selectedChart === 'uniformDefiances' && <TopUniformDefiancesByDepartmentChart />}
          {selectedChart === 'violationNatures' && <TopViolationNaturesByDepartment />}
          {selectedChart === 'categories' && <TopCategoriesChart />}
          {selectedChart === 'subcategories' && <TopSubcategoriesChart />}
          {selectedChart === 'totalViolationRecords' && <TotalViolationRecordsChart />}
          {selectedChart === 'violationRecordsByYearLevel' && <TopViolationRecordsByYearLevel />}
          {selectedChart === 'uniformDefianceByStatus' && <TopUniformDefiancesByStatus />}
        </Modal.Body>
      </Modal>
    </div>
  );
};


export default CoordinatorGraphs;
