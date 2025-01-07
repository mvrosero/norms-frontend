import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi'; 
import backgroundImage from '../../components/images/norms_welcome_page.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login-selection');
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%', 
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >

      <FiArrowRightCircle
        onClick={handleLoginClick}
        style={{
          position: 'absolute',
          bottom: '0', 
          right: '0', 
          marginBottom: '80px', 
          marginRight: '100px', 
          color: 'white',
          fontSize: '3em',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default LandingPage;
