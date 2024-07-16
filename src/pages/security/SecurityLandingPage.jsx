import React from 'react';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../../components/images/yellow_background.png';
import firstCardImage from '../../components/images/viewdefiance.png'; 
import secondCardImage from '../../components/images/createdefiance.png'; 

const SecurityLandingPage = () => {
  const navigate = useNavigate();

  const handleFirstCardClick = () => {
    navigate('/view-slips');
  };

  const handleSecondCardClick = () => {
    navigate('/create-slip');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
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
      <h5 style={{ fontFamily: 'Inter', marginBottom: '40px', fontSize: '50px', fontWeight: '900', marginTop: '10px', color: 'white' }}>Select Transaction</h5>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        {/* First card */}
        <div
          onClick={handleFirstCardClick}
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
          <img src={firstCardImage} alt="First Page" style={{ width: '160px', height: '160px', marginBottom: '20px' }} />
          <span style={{ fontSize: '20px', fontFamily: 'Poppins', textAlign: 'center', color: '#DAC50C' }}>View Slips</span>
        </div>
        {/* Second card */}
        <div
          onClick={handleSecondCardClick}
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
          <img src={secondCardImage} alt="Second Page" style={{ width: '160px', height: '160px', marginBottom: '20px' }} />
          <span style={{ fontSize: '20px', fontFamily: 'Poppins', textAlign: 'center', color: '#DAC50C' }}>Create New Slip</span>
        </div>
      </div>
      <div style={{ height: '60px' }} />
    </div>
  );
};

export default SecurityLandingPage;
