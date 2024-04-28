import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './General.css'; // Import the CSS file

import user_icon from "../../assets/images/default_profile.jpg";

const UserInfo = ({ name, role, profilePhoto }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  const handleSettings = () => {
    // Implement settings functionality here
  };

  return (
    <div className="profile-container"> {/* Use className instead of style */}
      <div className="profileInfo">
        <img src={user_icon} alt="Profile" className="profilePhoto" />
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

UserInfo.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string.isRequired,
};

UserInfo.defaultProps = {
  name: 'FULL NAME',
  role: 'Role',
  profilePhoto: 'default-profile-photo.jpg',
};

export default UserInfo;
