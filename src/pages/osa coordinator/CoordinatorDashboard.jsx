import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import CoordinatorNavigation from "./CoordinatorNavigation";
import CoordinatorInfo from "./CoordinatorInfo";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; 
import "../../pages/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faChartBar, faUser } from '@fortawesome/free-solid-svg-icons';
import yellowBackgroundImage from "../../components/images/yellow_background.png";

const StyledButton = styled(Button)`
  background-color: #006400!important;
  border-color: #0000ff!important;
  &:hover {
    background-color:#eee600!important;
    border-color: #0000ff!important;
  }
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
  { code: '1', name: 'CAS', fullName: 'College of Arts and Sciences' },
  { code: '2', name: 'CAF', fullName: 'College of Accountancy and Finance' },
  { code: '3', name: 'CBM', fullName: 'College of Business and Management' },
  { code: '4', name: 'CCJE', fullName: 'College of Criminal Justice Education' },
  { code: '5', name: 'CCS', fullName: 'College of Computer Studies' },
  { code: '6', name: 'CHS', fullName: 'College of Health Sciences' },
  { code: '7', name: 'COE', fullName: 'College of Engineering' },
  { code: '8', name: 'CTED', fullName: 'College of Teacher Education' }
];

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [userCounts, setUserCounts] = useState({});
  const role_id = parseInt(localStorage.getItem('role_id'), 10); // Assuming the roleId is stored in localStorage

  useEffect(() => {
    if (role_id !== 2) {
      navigate('/unauthorized'); // Redirect to an unauthorized page or login if roleId is not 2
    } else {
      fetchUserCounts();
    }
  }, [role_id, navigate]);

  const fetchUserCounts = async () => {
    try {
      const userCountsData = {
        CAS: 10,
        CAF: 10,
        CBM: 11,
        CCJE: 17,
        CCS: 20,
        CHS: 9,
        COE: 7,
        CTED: 4
      };
      setUserCounts(userCountsData);
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  const handleRecordsClick = () => {
    navigate('/coordinator-studentrecords');
  };

  const handleReportsClick = () => {
    navigate('/coordinator-incidentreports');
  };

  const handleClearanceClick = () => {
    navigate('/coordinator-onlineclearance');
  };

  if (role_id !== 2) {
    return null; // Optionally, render a loading or unauthorized message here
  }

  return (
    <>
      <CoordinatorNavigation />
      <CoordinatorInfo />
      <h6 className="page-title" style={{ marginBottom: '40px' }}> DASHBOARD </h6>
      <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>My Shortcuts</text>
      <div className="buttons-container d-flex justify-content-center mt-4">
        <StyledButton
          variant="primary"
          onClick={handleRecordsClick}
          className="mr-3"
          style={{
            width: "300px",
            height: "150px",
            fontSize: "20px",
            marginRight: "20px",
            marginBottom: "40px"
          }}
        >
          <FontAwesomeIcon icon={faFile} /> Offenses
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={handleReportsClick}
          className="mr-3"
          style={{
            width: "300px",
            height: "150px",
            fontSize: "20px",
            marginRight: "20px",
            marginBottom: "40px"
          }}
        >
          <FontAwesomeIcon icon={faChartBar} /> Sanctions
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={handleClearanceClick}
          style={{
            width: "300px",
            height: "150px",
            fontSize: "20px",
            marginBottom: "40px"
          }}
        >
          <FontAwesomeIcon icon={faUser} /> Records
        </StyledButton>
      </div>

      <text style={{ fontSize: '20px', fontWeight: '600', marginLeft: '120px' }}>Departments</text>
      <div className="department-cards-container" style={{ padding: '10px', paddingLeft: '120px' }}>
        <div className="row" style={{ padding: '10px', marginRight: '10px' }}>
          {departments.map((department, index) => (
            <div key={index} className="col-md-3 mb-4">
              <DepartmentCard department={department} userCount={userCounts[department.name]} />
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

const DepartmentCard = ({ department, userCount }) => (
  <Card style={{ width: '250px', height: '120px', backgroundImage: `url(${yellowBackgroundImage})` }}>
    <Card.Body>
      <Card.Title style={{ fontWeight: 'bold', color: 'white' }}>{department.fullName}</Card.Title>
      <Card.Text>
        <FontAwesomeIcon icon={faUser} /> {userCount || 0} Users
      </Card.Text>
    </Card.Body>
  </Card>
);

export default CoordinatorDashboard;
