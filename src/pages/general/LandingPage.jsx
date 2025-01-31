import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi'; 
import backgroundImage from '../../components/images/finalwecomepage.png';
import styled from '@emotion/styled';

const ViewButton = styled.button`
  border-radius: 40px;
  background: linear-gradient(45deg, #015901, #006637, #4aa616);
  color: white;
  border: none;
  padding: 12px 35px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  position: absolute;
  bottom: 55px;
  left: 220px;
  &:hover {
    background: linear-gradient(45deg, #4aa616, #006637, #015901);
  }
`;


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
        backgroundSize: 'cover', 
        backgroundPosition: 'top center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <ViewButton onClick={handleLoginClick}>Get Started</ViewButton>
    </div>
  );
};

export default LandingPage;
