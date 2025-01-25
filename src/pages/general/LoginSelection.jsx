import React from 'react';
import { useNavigate } from 'react-router-dom';

import background from '../../components/images/norms_background.png';
import studentImage from '../../components/images/student.png'; 
import employeeImage from '../../components/images/employee.png'; 

const LoginSelectionPage = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/student-login');
  };

  const handleEmployeeLogin = () => {
    navigate('/employee-login');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        paddingTop: '5vw', // Adjust the padding for smaller screens
      }}
    >
      <h5
        style={{
          fontFamily: 'Inter',
          marginBottom: '5vw', // Adjust the margin for smaller screens
          fontSize: '5vw', // Responsive font size
          fontWeight: '900',
          marginTop: '10px',
        }}
      >
        Select User Type
      </h5>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '5vw',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Student Card */}
        <div
          onClick={handleStudentLogin}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0D4809',
            padding: '5vw',
            borderRadius: '15px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40vw', // Responsive width
            maxWidth: '280px', // Max width to avoid too large on big screens
            height: '40vh', // Adjust height for smaller screens
            marginBottom: '5vw',
          }}
        >
          <img
            src={studentImage}
            alt="Student"
            style={{
              width: '30vw', // Use viewport width for responsive image size
              maxWidth: '120px', // Max width for larger screens
              marginBottom: '5vw',
            }}
          />
          <span style={{ fontSize: '6vw', fontFamily: 'Poppins', textAlign: 'center' }}>Student</span>
        </div>

        {/* Employee Card */}
        <div
          onClick={handleEmployeeLogin}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0D4809',
            padding: '5vw',
            borderRadius: '15px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40vw', // Responsive width
            maxWidth: '280px', // Max width to avoid too large on big screens
            height: '40vh', // Adjust height for smaller screens
            marginBottom: '5vw',
          }}
        >
          <img
            src={employeeImage}
            alt="Employee"
            style={{
              width: '30vw', // Use viewport width for responsive image size
              maxWidth: '120px', // Max width for larger screens
              marginBottom: '5vw',
            }}
          />
          <span style={{ fontSize: '6vw', fontFamily: 'Poppins', textAlign: 'center' }}>Employee</span>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionPage;
