import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";

import yellowBackgroundImage from "../../components/images/yellow_background.png";
import cafBackgroundImage from "../../components/images/caf.png";
import casBackgroundImage from "../../components/images/cas.png";
import cbmBackgroundImage from "../../components/images/cbm.png"; 
import ccjeBackgroundImage from "../../components/images/ccje.png";
import ccsBackgroundImage from "../../components/images/ccs.png"; 
import chsBackgroundImage from "../../components/images/chs.png";
import coeBackgroundImage from "../../components/images/coe.png";
import ctedBackgroundImage from "../../components/images/cted.png";


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

export default function AdminDashboard() {
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('role_id');
    if (token && roleId === '1') {
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

  if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '1') {
    return null; 
  }


return (
  <>
      <AdminNavigation />
      <AdminInfo />
      <h6 className="page-title"> DASHBOARD </h6>

      {/* Department Cards */}
      <div className="department-cards-container" style={{ padding: '10px', marginTop: '30px', paddingLeft: '120px' }}>
        <div className="row" style={{ padding: '10px', marginRight: '10px' }}>
          {departments.map((department, index) => (
            <div key={index} className="col-md-3 mb-4">
              <Link to={`/admin-usermanagement/${department.name}`} style={{ textDecoration: 'none' }}>
                <DepartmentCard department={department} userCount={userCounts[department.fullName]} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const DepartmentCard = ({ department, userCount }) => {
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
      backgroundImage = yellowBackgroundImage;
  }

  return (
    <Card style={{ width: '250px', height: '120px', backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'relative' }}>
      <Card.Body style={{ position: 'absolute', bottom: 0, left: 0, color: 'black', fontSize: '12px', zIndex: 1 }}>
        <Card.Title style={{ fontWeight: 'bold', fontSize: '14px', width: '60%', textAlign: 'start', whiteSpace: 'normal', display: 'inline-block', marginBottom: '5px' }}> {department.fullName} </Card.Title>
        <Card.Text style={{ textAlign: 'left' }}>
          <FontAwesomeIcon icon={faUser} /> {userCount || 0} Users
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
