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
        backgroundSize: '100% 100%', 
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
      <h5 style={{ fontFamily: 'Inter', marginBottom: '40px', fontSize: '50px', fontWeight: '900', marginTop: '10px' }}>Select User Type </h5>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
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
          }}
        >
          <img src={studentImage} alt="Student" style={{ width: '120px', marginBottom: '30px' }} /> 
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
          }}
        >
          <img src={employeeImage} alt="Employee" style={{ width: '120px', marginBottom: '30px' }} /> 
          <span style={{ fontSize: '25px', fontFamily: 'Poppins', textAlign: 'center' }}>Employee</span> 
        </div>
      </div>
      <div style={{ height: '60px' }} /> 
    </div>
  );
};


export default LoginSelectionPage;
