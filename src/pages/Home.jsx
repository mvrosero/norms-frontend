import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../App.css'
const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login-selection');
  };

  return (
    <div
      style={{
        backgroundImage: `url()`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: '3em',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        NCF-OSA Records Management System
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '2em',
        }}
      >
        <button
          onClick={handleLoginClick}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.5em 1em',
            border: 'none',
            borderRadius: '0.25em',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          Login
        </button>
        <FaArrowRight
          style={{
            marginLeft: '0.5em',
            fontSize: '1.5em',
            color: 'white', // Set the color of the arrow icon
          }}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
