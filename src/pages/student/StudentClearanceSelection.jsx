import React from 'react';
import { useNavigate } from 'react-router-dom';

import background from '../../components/images/registration_background.png';
import requestImage from '../../components/images/requestclearance.png'; // Import request image
import viewImage from '../../components/images/viewclearance.png'; // Import view image

const ClearanceSelection = () => {
  const navigate = useNavigate();

  const handleRequestLogin = () => {
    // Navigate to clearance request page
    navigate('/clearance-request');
  };

  const handleViewLogin = () => {
    // Navigate to view clearance page
    navigate('/student-myclearances');
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
      <h5 style={{ fontFamily: 'Inter', marginBottom: '40px', fontSize: '50px', fontWeight: '900', marginTop: '10px', color: 'white' }}>Select Transaction </h5>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        {/* Request card */}
        <div
          onClick={handleRequestLogin}
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
          <img src={requestImage} alt="Request" style={{ width: '183px', marginBottom: '20px' }} /> {/* Adjusted image size */}
          <span style={{ fontSize: '20px', fontFamily: 'Poppins', textAlign: 'center', color: '#DAC50C' }}>Clearance Request</span> {/* Adjusted font size, family, and color */}
        </div>
        {/* View card */}
        <div
          onClick={handleViewLogin}
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
          <img src={viewImage} alt="View" style={{ width: '160px', marginBottom: '20px' }} /> {/* Adjusted image size */}
          <span style={{ fontSize: '20px', fontFamily: 'Poppins', textAlign: 'center', color: '#DAC50C' }}>View Clearance</span> {/* Adjusted font size, family, and color */}
        </div>
      </div>
      <div style={{ height: '60px' }} /> {/* Increased space below the cards */}
    </div>
  );
};

export default ClearanceSelection;
