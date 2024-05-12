import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";

import yellowBackgroundImage from "../../components/images/yellow_background.png"

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

export default function AdminDashboard() {
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    // Fetch user counts for each department from the database
    fetchUserCounts();
  }, []);

  const fetchUserCounts = async () => {
    try {
      // Perform API call to fetch user counts for each department
      const response = await axios.get('/api/user/counts');

      // Update state with user counts
      setUserCounts(response.data);
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };
  

  return (
    <>
      <AdminNavigation />
      <AdminInfo />
      <h6 className="page-title"> DASHBOARD </h6>

      {/* Department Cards */}
      <div className="department-cards-container" style={{ padding: '10px', marginTop: '30px', paddingLeft: '120px' }}>
        <div className="row" style={{ padding: '10px', marginRight: '10px' }}>
          {departments.slice(0, 4).map((department, index) => (
            <div key={index} className="col-md-3 mb-4">
              <DepartmentCard department={department} userCount={userCounts[department.name]} />
            </div>
          ))}
        </div>
        <div className="row" style={{ padding: '10px', marginRight: '10px' }}>
          {departments.slice(4).map((department, index) => (
            <div key={index} className="col-md-3 mb-4">
              <DepartmentCard department={department} userCount={userCounts[department.name]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const DepartmentCard = ({ department, userCount }) => (
  <Card style={{ width: '250px', height: '120px', backgroundImage: `url(${yellowBackgroundImage})` }}>
    <Card.Body style={{ position: 'relative', zIndex: 1 }}>
      <Card.Title style={{ color: 'white', fontWeight: 'bold' }}>{department.fullName}</Card.Title>
      <Card.Text>
        <FontAwesomeIcon icon={faUser} /> {userCount || 0} Users
      </Card.Text>
    </Card.Body>
  </Card>
);

