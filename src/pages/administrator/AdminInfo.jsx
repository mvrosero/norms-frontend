import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../../styles/General.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../../components/images/default_profile.jpg';

const AdminInfo = ({ role }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user_icon); 
  const [userName, setUserName] = useState(''); 
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id'); 


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`https://test-backend-api-2.onrender.com/employee/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });

        const userData = response.data[0]; 
        if (userData) {
          const fullName = `${userData.first_name} ${userData.last_name}`.trim();
          setUserName(fullName);

          const photoFilename = userData.profile_photo_filename;
          if (photoFilename) {
            const photoUrl = `https://test-backend-api-2.onrender.com/uploads/profile_photo/${photoFilename}`;
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

  const handleSettings = () => {
    navigate('/admin-settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role_id');
    localStorage.removeItem('user_id');
    localStorage.removeItem('employee_idnumber');
    navigate('/admin-login');
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
            e.target.src = user_icon; 
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

AdminInfo.propTypes = {
  role: PropTypes.string.isRequired,
};

AdminInfo.defaultProps = {
  role: 'Administrator',
};


export default AdminInfo;
