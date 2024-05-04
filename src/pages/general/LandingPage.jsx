import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi'; // Changed icon import
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
        backgroundSize: '100% 100%', // Adjusted background size
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Using FiArrowRightCircle icon */}
      <FiArrowRightCircle
        onClick={handleLoginClick}
        style={{
          position: 'absolute',
          bottom: '0', // Positioned at the bottom
          right: '0', // Positioned at the right
          marginBottom: '80px', // Added space to align with the line on the background image
          marginRight: '80px', // Added space to align with the line on the background image
          color: 'white',
          fontSize: '3em',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default LandingPage;
