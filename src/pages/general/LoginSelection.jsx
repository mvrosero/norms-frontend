import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUserShield } from 'react-icons/fa'; // Import icons for student and employee

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
        backgroundImage: `url()`, // Add background image URL if needed
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white', // Set text color
      }}
    >
      <h2 style={{ marginBottom: '2em' }}>Login Selection</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {/* Student login button */}
        <button
          onClick={handleStudentLogin}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '1em 2em',
            border: 'none',
            borderRadius: '0.25em',
            cursor: 'pointer',
            fontSize: '1em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaUserGraduate style={{ marginRight: '0.5em' }} />
          Student Login
        </button>
        {/*Employee login button */}
        <button
          onClick={handleEmployeeLogin}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '1em 2em',
            border: 'none',
            borderRadius: '0.25em',
            cursor: 'pointer',
            fontSize: '1em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaUserShield style={{ marginRight: '0.5em' }} />
          Employee Login
        </button>
      </div>
    </div>
  );
};

export default LoginSelectionPage;
