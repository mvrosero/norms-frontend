import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import styled from "@emotion/styled";

import CoordinatorNavigation from "./CoordinatorNavigation";
import CoordinatorInfo from "./CoordinatorInfo";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "../../pages/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import yellowBackgroundImage from "../../components/images/yellow_background.png";
import cafBackgroundImage from "../../components/images/caf.png";
import casBackgroundImage from "../../components/images/cas.png";
import cbmBackgroundImage from "../../components/images/cbm.png"; 
import ccjeBackgroundImage from "../../components/images/ccje.png";
import ccsBackgroundImage from "../../components/images/ccs.png"; 
import chsBackgroundImage from "../../components/images/chs.png";
import coeBackgroundImage from "../../components/images/coe.png";
import ctedBackgroundImage from "../../components/images/cted.png";

import offensesImage from "../../components/images/offenses.png";
import sanctionsImage from "../../components/images/sanctions.png";
import academicYearImage from "../../components/images/academic_year.png";

const OffensesButton = styled(Button)`
  background-image: url(${offensesImage})!important;
  background-size: cover;
  border-color: transparent!important;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 30px;
  font-weight: 600;
  padding: 20px;
`;

const SanctionsButton = styled(Button)`
  background-image: url(${sanctionsImage})!important;
  background-size: cover;
  border-color: transparent!important;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 30px;
  font-weight: 600;
  padding: 20px;
`;

const AcademicYearButton = styled(Button)`
  background-image: url(${academicYearImage})!important;
  background-size: cover;
  border-color: transparent!important;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 30px;
  font-weight: 600;
  padding: 20px;
`;

const data = [
  { name: 'Jan', pv: 2400 },
  { name: 'Feb', pv: 1398 },
  { name: 'Mar', pv: 9800 },
  { name: 'Apr', pv: 3908 },
  { name: 'May', pv: 4800 },
  { name: 'Jun', pv: 3800 },
  { name: 'Jul', pv: 4300 },
  { name: 'Aug', pv: 3800 },
  { name: 'Sep', pv: 4300 },
  { name: 'Oct', pv: 3800 },
  { name: 'Nov', pv: 4300 },
  { name: 'Dec', pv: 3800 },
];

const departments = [
  { code: '2', name: 'CAF', fullName: 'College of Accountancy and Finance' },
  { code: '1', name: 'CAS', fullName: 'College of Arts and Sciences' },
  { code: '6', name: 'CHS', fullName: 'College of Health Sciences' },
  { code: '4', name: 'CCJE', fullName: 'College of Criminal Justice Education' },
  { code: '5', name: 'CCS', fullName: 'College of Computer Studies' },
  { code: '7', name: 'COE', fullName: 'College of Engineering' },
  { code: '3', name: 'CBM', fullName: 'College of Business and Management' },
  { code: '8', name: 'CTED', fullName: 'College of Teacher Education' }
];


const CoordinatorDashboard = () => {
  const navigate = useNavigate();

  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('role_id');
    if (token && roleId === '2') {
      fetchUserCounts(token);
    } else {
      console.error("Token is required for accessing the dashboard or invalid role.");
    }
  }, []);

  const fetchUserCounts = async (token) => {
    try {
      const response = await axios.get(`http://localhost:9000/user-counts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserCounts(response.data);
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '2') {
    return null; // Do not render anything if token or role_id is invalid
  }

  const handleRecordsClick = () => {
    navigate('/manage-categories');
  };

  const handleSanctionsClick = () => {
    navigate('/manage-sanctions');
  };

  const handleOffensesClick = () => {
    navigate('/manage-offenses');
  };

  return (
    <>
      <CoordinatorNavigation />
      <CoordinatorInfo />
      <h6 className="page-title" style={{ marginBottom: '40px' }}> DASHBOARD </h6>
      <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>My Shortcuts</text>
      <div className="buttons-container d-flex justify-content-center mt-4">
        <OffensesButton
          variant="primary"
          onClick={handleOffensesClick}
          className="mr-3"
          style={{
            width: "300px",
            height: "150px",
            marginLeft: "100px",
            marginRight: "40px",
            marginBottom: "40px"
          }}
        >
          Offenses
        </OffensesButton>
        <SanctionsButton
          variant="primary"
          onClick={handleSanctionsClick}
          className="mr-3"
          style={{
            width: "300px",
            height: "150px",
            marginRight: "40px",
            marginBottom: "40px"
          }}
        >
          Sanctions
        </SanctionsButton>
        <AcademicYearButton
          variant="primary"
          onClick={handleRecordsClick}
          style={{
            width: "300px",
            height: "150px",
            marginBottom: "40px",
            textAlign: 'left'
          }}
        >
          Categories
        </AcademicYearButton>
      </div>

      <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Departments</text>
      <div className="department-cards-container" style={{ padding: '10px', marginTop: '10px', paddingLeft: '120px' }}>
        <div className="row" style={{ padding: '10px', marginRight: '10px' }}>
          {departments.map((department, index) => (
            <div key={index} className="col-md-3 mb-4">
              <DepartmentCard department={department} userCount={userCounts[department.fullName]} />
            </div>
          ))}
        </div>
      </div>

      <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Graphs</text>
      <div className="chart-container p-4" style={{ marginLeft: '120px', marginTop: '20px' }}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#006400" />
        </BarChart>
      </div>
    </>
  );
};

const DepartmentCard = ({ department, userCount }) => {
  const navigate = useNavigate();

  let backgroundImage;
  switch (department.name) {
    case 'CAS':
      backgroundImage = casBackgroundImage;
      break;
    case 'CAF':
      backgroundImage = cafBackgroundImage;
      break;
    case 'CBM':
      backgroundImage = cbmBackgroundImage;
      break;
    case 'CCJE':
      backgroundImage = ccjeBackgroundImage;
      break;
    case 'CCS':
      backgroundImage = ccsBackgroundImage;
      break;
    case 'CHS':
      backgroundImage = chsBackgroundImage;
      break;
    case 'COE':
      backgroundImage = coeBackgroundImage;
      break;
    case 'CTED':
      backgroundImage = ctedBackgroundImage;
      break;
    default:
      backgroundImage = yellowBackgroundImage; // Fallback image
  }

  const handleCardClick = () => {
    navigate(`/coordinator-studentrecords/${department.name}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        height: '150px',
        border: 'none',
        textAlign: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer' // Make it clear that the card is clickable
      }}
    >
      <Card.Body style={{ position: 'absolute', bottom: 0, left: 0, color: 'black', fontSize: '12px', zIndex: 1 }}>
        <Card.Title style={{ 
          fontWeight: 'bold', 
          fontSize: '14px', 
          width: '60%', 
          textAlign: 'start', 
          whiteSpace: 'normal', 
          marginBottom: '10px' 
        }}>
          {department.fullName}
        </Card.Title>
        <Card.Text style={{ textAlign: 'left' }}>
          <FontAwesomeIcon icon={faUser} /> {userCount || 0} Users
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CoordinatorDashboard;
