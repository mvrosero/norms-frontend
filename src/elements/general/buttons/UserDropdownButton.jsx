import React, { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';

function UserDropdownButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    if (option === 'Student') {
      window.location.href = 'https://norms-frontend.vercel.app/register-student';
    } else if (option === 'Employee') {
      window.location.href = 'https://norms-frontend.vercel.app/register-employee';
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#FAD32E', 
          color: 'white', 
          fontWeight: '900',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          marginLeft: '10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Add User
        <FaAngleDown style={{ marginLeft: '10px', fontSize: '20px', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {isOpen && (
        <div
          style={{
            display: 'block',
            position: 'absolute',
            backgroundColor: 'white', 
            minWidth: '160px',
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ccc', 
            borderRadius: '10px', 
            marginTop: '5px', 
          }}
        >
          <a href="#" style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block', borderBottom: '1px solid #ccc' }} onClick={() => handleOptionClick('Student')}>Student</a>
          <a href="#" style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block', borderBottom: '1px solid #ccc' }} onClick={() => handleOptionClick('Employee')}>Employee</a>
        </div>
      )}
    </div>
  );
}

export default UserDropdownButton;
