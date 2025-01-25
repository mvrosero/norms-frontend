import React from 'react';
import { useNavigate } from 'react-router-dom';

import background from '../../components/images/norms_background.png';
import studentImage from '../../components/images/student.png'; 
import employeeImage from '../../components/images/employee.png'; 
import '../../styles/Responsiveness.css'

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
        backgroundSize: 'cover',  // Adjusted to make it more responsive
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white', 
        paddingTop: '40px', 
      }}
    >
      <h5
        style={{
          fontFamily: 'Inter',
          marginBottom: '40px',
          fontSize: '5vw',  // Make the font size relative to viewport width
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
          gap: '20px',
          justifyContent: 'center', // Center cards on small screens
          flexWrap: 'wrap', // Allow cards to wrap on smaller screens
        }}
      >
        {/* Student Card */}
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
            width: '280px',
            height: '300px',
            marginRight: '20px',
            marginBottom: '20px', // Add margin for spacing between cards when wrapping
          }}
        >
          <img 
            src={studentImage} 
            alt="Student" 
            style={{ width: '120px', marginBottom: '30px' }} 
          />
          <span style={{ fontSize: '25px', fontFamily: 'Poppins', textAlign: 'center' }}>Student</span>
        </div>

        {/* Employee Card */}
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
            width: '280px',
            height: '300px',
            marginLeft: '20px',
            marginBottom: '20px', // Add margin for spacing between cards when wrapping
          }}
        >
          <img 
            src={employeeImage} 
            alt="Employee" 
            style={{ width: '120px', marginBottom: '30px' }} 
          />
          <span style={{ fontSize: '25px', fontFamily: 'Poppins', textAlign: 'center' }}>Employee</span>
        </div>
      </div>
      <div style={{ height: '60px' }} />
    </div>
  );
};

export default LoginSelectionPage;
