import React from 'react';
import { useNavigate } from 'react-router-dom';

import background from '../../components/images/norms_background.png';
import studentImage from '../../components/images/student.png'; // Import student image
import employeeImage from '../../components/images/employee.png'; // Import employee image

const LoginSelectionPage = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    // Navigate to student login page
    navigate('/student-login');
  };

  const handleEmployeeLogin = () => {
    // Navigate to employee login page
    navigate('/employee-login');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: '100% 100%', // Adjusted background size
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white', // Set text color
        paddingTop: '40px', // Increased space at the top
      }}
    >
      <h5 style={{ fontFamily: 'Inter', marginBottom: '40px', fontSize: '50px', fontWeight: '900', marginTop: '10px' }}>Select User Type </h5>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        {/* Student card */}
        <div
          onClick={handleStudentLogin}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0D4809',
            padding: '40px',
            borderRadius: '15px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '280px', // Adjusted width
            height: '300px', // Adjusted height
            marginRight: '20px', // Added margin between cards
          }}
        >
          <img src={studentImage} alt="Student" style={{ width: '120px', marginBottom: '30px' }} /> {/* Adjusted image size */}
          <span style={{ fontSize: '25px', fontFamily: 'Poppins', textAlign: 'center' }}>Student</span> {/* Adjusted font size and family */}
        </div>
        {/* Employee card */}
        <div
          onClick={handleEmployeeLogin}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0D4809',
            padding: '40px',
            borderRadius: '15px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '280px', // Adjusted width
            height: '300px', // Adjusted height
            marginLeft: '20px', // Added margin between cards
          }}
        >
          <img src={employeeImage} alt="Employee" style={{ width: '120px', marginBottom: '30px' }} /> {/* Adjusted image size */}
          <span style={{ fontSize: '25px', fontFamily: 'Poppins', textAlign: 'center' }}>Employee</span> {/* Adjusted font size and family */}
        </div>
      </div>
      <div style={{ height: '60px' }} /> {/* Increased space below the cards */}
    </div>
  );
};

export default LoginSelectionPage;
