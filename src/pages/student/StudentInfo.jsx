import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../general/General.css';
import { useNavigate } from "react-router-dom";
import user_icon from "../../assets/images/default_profile.jpg";

const StudentInfo = ({ name, role, profilePhoto }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();  // Clear all items in local storage
    navigate('/student-login'); 
  };

  const handleSettings = () => {
    navigate('/student-settings'); 
  };

  return (
    <div className="profile-container">
      <div className="profileInfo">
        <img src={profilePhoto || user_icon} alt="Profile" className="profilePhoto" />
        <div className="userInfo">
          <p className="name">{name}</p>
          <p className="role">{role}</p>
        </div>
      </div>
      <div className="dropdownIcon" onClick={toggleDropdown}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M7.5 9.5l4 4 4-4h-8z"></path>
        </svg>
      </div>
      {isDropdownOpen && (
        <div className="dropdownMenu">
          <div className="dropdownItem" onClick={handleSettings}>
            Settings
          </div>
          <div className="dropdownItem" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

StudentInfo.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string,
};

StudentInfo.defaultProps = {
  name: 'FULL NAME',
  role: 'Student',
  profilePhoto: user_icon,
};

export default StudentInfo;
