import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import NCFStaffNavigation from "./NCFStaffNavigation";
import UserInfo from "../general/UserInfo";
import Card from 'react-bootstrap/Card';
import "../../pages/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faChartBar, faUser } from '@fortawesome/free-solid-svg-icons';

const StyledButton = styled(Button)`
  background-color: transparent!important;
  border-color: transparent!important;
  color: #bbb; /* Lighter gray color */
  font-size: 12px; /* Smaller font size */
  text-decoration: underline; /* Underline the text */
  font-weight: 100; /* Adjusting font weight */
  position: absolute;
  bottom: 2px;
  right: 0px;
  left: 80px;
  text-align: right;
  padding: 10px 15px;
`;

const departments = [
  { abbreviation: 'CAF', fullName: 'College of Accountancy and Finance' },
  { abbreviation: 'CAS', fullName: 'College of Arts and Sciences' },
  { abbreviation: 'CBM', fullName: 'College of Business and Management' },
  { abbreviation: 'CCS', fullName: 'College of Computer Studies' },
  { abbreviation: 'CHS', fullName: 'College of Health Sciences' },
  { abbreviation: 'CCJE', fullName: 'College of Criminal Justice Education' },
  { abbreviation: 'COE', fullName: 'College of Engineering' },
  { abbreviation: 'CTED', fullName: 'College of Teacher Education' },
];

const DepartmentCard = ({ abbreviation, fullName }) => (
  <Card style={{ width: '240px', height: '130px', margin: '10px', backgroundColor: '#006400', color: 'white', fontWeight: 'bold', position: 'relative' }}> {/* Changing card color to green and text color to white and bolder */}
    <Card.Body>
      <Card.Title style={{ color: 'white', fontWeight: 'bold' }}>{abbreviation}</Card.Title> {/* Changing text color to white and bolder */}
      <Card.Text style={{ color: 'white', fontWeight: 'bold' }}>{fullName}</Card.Text> {/* Changing text color to white and bolder */}
      <StyledButton variant="primary">View Details</StyledButton>
    </Card.Body>
  </Card>
);

export default function NCFStaffDashboard() {

  return (
    <>
      <NCFStaffNavigation />
      <UserInfo />
      <h6 className="page-title">DASHBOARD</h6>
      <div className="chart-container p-4" style={{ marginLeft: '120px', marginTop: '1px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {departments.map(({ abbreviation, fullName }) => (
            <DepartmentCard key={abbreviation} abbreviation={abbreviation} fullName={fullName} />
          ))}
        </div>
      </div>
    </>
  );
}
