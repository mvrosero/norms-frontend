import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../../styles/General.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../../components/images/default_profile.jpg';

const SecurityInfo = ({ role }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user_icon); // Default to user_icon initially
  const [userName, setUserName] = useState(''); // State to hold the user's name
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id'); // Get user ID from local storage

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/employee/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
          }
        });

        const userData = response.data[0]; // Assuming the response is an array with the user data
        if (userData) {
          const fullName = `${userData.first_name} ${userData.last_name}`.trim();
          setUserName(fullName);

          const photoFilename = userData.profile_photo_filename;
          if (photoFilename) {
            const photoUrl = `http://localhost:9000/uploads/profile_photo/${photoFilename}`;
            setProfilePhoto(photoUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (userId) {
      fetchProfileData();
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
    navigate('/security-settings'); // Adjust path as needed
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
          <p className="name">{userName}</p>
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
  role: PropTypes.string.isRequired,
};

SecurityInfo.defaultProps = {
  role: 'Security',
};

export default SecurityInfo;
