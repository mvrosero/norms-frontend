import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationCircle, FaRegFrown, FaRegGrin, FaThumbsUp } from 'react-icons/fa'; // Example icons
import { HiSpeakerphone } from "react-icons/hi";

const MyRecordsVisual = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const offenseNames = {
    1: "Loitering",
    2: "Fighting",
    3: "Disrespect",
    4: "Tardiness",
    // Add more offenses here
  };

  // Example mapping between offense_id and icons
  const offenseIconMap = {
    1: <HiSpeakerphone />,  // Example offense with id 1
    2: <FaRegFrown />,           // Example offense with id 2
    3: <FaRegGrin />,            // Example offense with id 3
    4: <FaThumbsUp />,           // Example offense with id 4
    // Add your 33 offenses here with their corresponding icons
  };

  // Check for the student_idnumber, token, and roleId in the useEffect hook
  useEffect(() => {
    const student_idnumber = localStorage.getItem('student_idnumber');
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('role_id');

    if (!token || roleId !== '3') {
      navigate('/unauthorized', { replace: true });
    } else if (!student_idnumber) {
      setError('Student ID number is missing in localStorage');
      setLoading(false);
    } else {
      fetchRecords(student_idnumber); // Fetch records if authorized
    }
  }, [navigate]);

  const fetchRecords = async (studentIdNumber) => {
    try {
      const response = await fetch(`https://test-backend-api-2.onrender.com/myrecords-visual/${studentIdNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setSubcategories(data); // Set fetched data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine icon color based on count
  const renderIconColor = (count) => {
    if (count === 0) return '#C1C1C1';  // Light gray for count 0
    if (count === 1) return '#F7C948';  // Yellow
    if (count === 2) return '#FF7A00';  // Orange
    return '#ED0303';  // Red for 3 or more
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {Object.keys(subcategories).map((subcategoryName) => (
        <div
          key={subcategoryName}
          style={{
            width: '1050px',
            backgroundColor: 'white',
            border: '1px solid #818181',
            borderRadius: '5px',
            padding: '20px',
            marginLeft: '90px',
            cursor: 'pointer',
          }}
        >
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#242424',
              fontSize: '20px',
              margin: '0 0 10px 0',
            }}
          >
            {subcategoryName}
          </h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            {Object.entries(subcategories[subcategoryName]).map(([offenseId, count]) => (
              <div
                key={offenseId}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  const tooltip = e.currentTarget.querySelector('.tooltip-content');
                  tooltip.style.visibility = 'visible';
                  tooltip.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.querySelector('.tooltip-content');
                  tooltip.style.visibility = 'hidden';
                  tooltip.style.opacity = 0;
                }}
              >
                {/* Render the corresponding icon for each offense based on offense_id */}
                <div style={{ fontSize: '30px', color: renderIconColor(count), cursor: 'pointer' }}>
                  {offenseIconMap[offenseId] || <FaExclamationCircle />} {/* Default to FaExclamationCircle if no specific icon */}
                </div>

                {/* Tooltip for offense name and count */}
                <div
                  className="tooltip-content"
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '100%',
                    transform: 'translateX(-50%)',
                    color: 'black',
                    backgroundColor: '#D9D9D9',
                    border: '1px solid #808080',
                    padding: '10px 10px',
                    width: '300px',
                    borderRadius: '5px',
                    visibility: 'hidden', // Hidden by default
                    opacity: 0, // Hidden by default
                    transition: 'visibility 0s, opacity 0.3s linear', // Smooth transition
                    zIndex: 10,
                    pointerEvents: 'none',
                    fontSize: '14px', // Optional: Define font size for consistency
                    fontWeight: 'normal',
                  }}
                >
                  <p
                    style={{
                      margin: '0',
                      fontSize: '14px',
                    }}
                  >
                   {offenseNames[offenseId] || 'Unknown Offense'}: {count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRecordsVisual;
