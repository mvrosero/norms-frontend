import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../general/General.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../../assets/images/default_profile.jpg';

const SecurityInfo = ({ name, role }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user_icon); // Default to user_icon initially
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id'); // Get user ID from local storage

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/profile-photo/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
          }
        });

        const photoFilename = response.data.profile_photo_filename;
        if (photoFilename) {
          const photoUrl = `http://localhost:9000/uploads/profile_photo/${photoFilename}`;
          setProfilePhoto(photoUrl);
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    if (userId) {
      fetchProfilePhoto();
    }
  }, [userId]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role_id');
    localStorage.removeItem('user_id');
    localStorage.removeItem('employee_idnumber');

    navigate('/employee-login');
  };

  const handleSettings = () => {
    navigate('/account-settings'); // Adjust path as needed
  };

  return (
    <div className="profile-container">
      <div className="profileInfo">
        <img
          src={profilePhoto}
          alt="Profile"
          className="profilePhoto"
          onError={(e) => {
            console.error('Error loading image:', e.target.src);
            e.target.src = user_icon; // Fallback to default image on error
          }}
        />
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

SecurityInfo.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string,
};

SecurityInfo.defaultProps = {
  name: 'FULL NAME',
  role: 'Security',
  profilePhoto: user_icon,
};

export default SecurityInfo;
