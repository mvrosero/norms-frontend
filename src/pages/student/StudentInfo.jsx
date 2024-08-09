import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../general/General.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../../assets/images/default_profile.jpg';

const StudentInfo = ({ role }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user_icon);
  const [userName, setUserName] = useState(''); // State to hold the user's name
  const navigate = useNavigate();
  const studentId = localStorage.getItem('student_idnumber'); // Get student ID from local storage

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/student/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
          }
        });

        const studentData = response.data[0];
        if (studentData) {
          const fullName = `${studentData.first_name} ${studentData.last_name}`.trim();
          setUserName(fullName);

          const photoFilename = studentData.profile_photo_filename;
          if (photoFilename) {
            const photoUrl = `http://localhost:9000/uploads/profile_photo/${photoFilename}`;
            setProfilePhoto(photoUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (studentId) {
      fetchProfileData();
    }
  }, [studentId]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all items in local storage
    navigate('/student-login');
  };

  const handleSettings = () => {
    navigate('/student-settings');
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

StudentInfo.propTypes = {
  role: PropTypes.string.isRequired,
};

StudentInfo.defaultProps = {
  role: 'Student',
};

export default StudentInfo;
