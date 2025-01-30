import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSpeakerphone, HiAcademicCap } from 'react-icons/hi';
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FaIdCard, FaPhotoVideo, FaExclamationCircle, FaWalking } from 'react-icons/fa';
import { GiBrassKnuckles, GiRiotShield, GiPerspectiveDiceSixFacesThree, GiCardQueenHearts, GiConversation, GiSchoolBag, GiSpray, GiLighter, GiTargetPoster, GiScales, GiPunch  } from 'react-icons/gi';
import { MdGroups2, MdSignLanguage, MdClass } from 'react-icons/md';
import { IoMdClock, IoMdBeer } from 'react-icons/io';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { PiWarningFill, PiExamFill } from "react-icons/pi";
import { FaBriefcase, FaGun, FaBuildingColumns, FaPersonCircleExclamation, FaHeartCircleExclamation, FaMoneyBill1Wave } from "react-icons/fa6";
import { IoShirt } from "react-icons/io5";
import { BsCameraFill, BsTrashFill, BsFillDoorClosedFill } from "react-icons/bs";

const MyRecordsVisual = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const offenseNames = {
    1: "Loitering during class hours",
    2: "Intentionally disturbing classes by shouting, chanting, talking aloud, and singing in corridors",
    3: "Incomplete and improper use of uniform or wearing an attire not befitting the school’s dress code policy, and non-wearing of ID",
    13: "Littering on campus or non-compliance to CLAYGO policy",
    15: "Smoking within the school premises",
    18: "Posting printed materials without the approval of authorized school officials",
    19: "Misinterpretation by borrowing one’s ID and lending another person’s ID",
    20: "Trespassing entry and exit through unauthorized and/or prohibited areas",
    21: "Unauthorized use of college facilities",
    22: "Vandalism or destroying or damaging school properties",
    23: "Insubordination or disobedience or disrespect to school authorities, lawful orders, and signs",
    24: "Violation of curfew hours",
    25: "Possessing, viewing, and reading objects, pictures, or pieces of literature that are pornographic",
    26: "Use of profane language and/or gestures",
    27: "Any form of dishonesty",
    28: "Any scandalous, malicious, and/or disturbing public display of affection",
    29: "Attending class not official enrolled",
    30: "Violence and physical assault/injury",
    31: "Stealing of money and/or property of co-students and employees",
    32: "Slander, libel, and rumor-mongering",
    33: "Liquor and/or prohibited drugs",
    34: "Possession or use of playing/gambling card and/or devices",
    35: "Indulging in any form of betting or gambling inside the school",
    36: "Mass action and subversive activities",
    37: "Extortion/forcibly asking money from anybody/bribery in any form",
    38: "Participating in any mob or riot within the school premises",
    39: "Falsification and/or misinterpretation of documents, records, and credentials",
    40: "Misappropriation of student organization funds, or misuse of another person’s money or funds, or similar acts",
    41: "Cheating",
    42: "Illegal possession of a deadly weapon such as ice pick, knife, gun, ammunition improvised weapon, etc.",
    43: "Public scandal",
    44: "Hazing",
    45: "Commision of a minor offense for the fifth time and beyond",
    46: "Violation of any rule and/or promulgated by the Higher Education (CHED)",
    47: "Any other misbehavior or misconduct that endangers or threatens the health and/or safety of an individual in the school premises or may adversely affect the student’s welfare"
  };


  const offenseIconMap = {
    1: <FaWalking />,  // Loitering during class hours*
    2: <HiSpeakerphone />,  // Intentionally disturbing classes by shouting, chanting, talking aloud, and singing in corridors
    3: <IoShirt />,  // Incomplete and improper use of uniform or wearing attire not befitting the school’s dress code policy
    13: <BsTrashFill />,  // Littering on campus or non-compliance to CLAYGO policy
    15: <GiLighter />,  // Smoking within the school premises
    18: <GiTargetPoster />,  // Posting printed materials without the approval of authorized school officials
    19: <FaIdCard />,  // Misinterpretation by borrowing one’s ID and lending another person’s ID
    20: <BsFillDoorClosedFill />,  // Trespassing entry and exit through unauthorized and/or prohibited areas
    21: <FaBuildingColumns />,  // Unauthorized use of college facilities
    22: <GiSpray />,  // Vandalism or destroying or damaging school properties
    23: <FaPersonCircleExclamation  />,  // Insubordination or disobedience or disrespect to school authorities
    24: <IoMdClock />,  // Violation of curfew hours
    25: <FaPhotoVideo />,  // Possessing, viewing, and reading objects, pictures, or pieces of literature that are pornographic
    26: <MdSignLanguage />,  // Use of profane language and/or gestures
    27: <PiExamFill />,  // Any form of dishonesty
    28: <FaHeartCircleExclamation  />,  // Any scandalous, malicious, and/or disturbing public display of affection
    29: <MdClass />,  // Attending class not officially enrolled
    30: <GiPunch />,  // Violence and physical assault/injury
    31: <GiSchoolBag />,  // Stealing of money and/or property of co-students and employees
    32: <GiConversation />,  // Slander, libel, and rumor-mongering
    33: <IoMdBeer />,  // Liquor and/or prohibited drugs
    34: <GiCardQueenHearts />,  // Possession or use of playing/gambling card and/or devices
    35: <GiPerspectiveDiceSixFacesThree  />,  // Indulging in any form of betting or gambling inside the school
    36: <MdGroups2  />,  // Mass action and subversive activities
    37: <FaMoneyBill1Wave />,  // Extortion/forcibly asking money from anybody/bribery
    38: <GiRiotShield />,  // Participating in any mob or riot within the school premises
    39: <HiClipboardDocumentList />,  // Falsification and/or misinterpretation of documents, records, and credentials
    40: <FaBriefcase  />,  // Misappropriation of student organization funds or misuse of another person’s money or funds
    41: <HiAcademicCap />,  // Cheating
    42: <FaGun />,  // Illegal possession of a deadly weapon
    43: <BsCameraFill />,  // Public scandal
    44: <GiBrassKnuckles />,  // Hazing
    45: <PiWarningFill />,  // Commission of a minor offense for the fifth time and beyond
    46: <GiScales />,  // Violation of any rule promulgated by the Higher Education (CHED)
    47: <AiFillSafetyCertificate />  // Any other misbehavior or misconduct that endangers or threatens the health and/or safety  
  };

  // Get the student id number
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
      fetchRecords(student_idnumber); 
    }
  }, [navigate]);


  // Fetch violation records of the selected student
  const fetchRecords = async (studentIdNumber) => {
    try {
      const response = await fetch(`https://test-backend-api-2.onrender.com/myrecords-visual/${studentIdNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setSubcategories(data); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  // Function to determine icon color based on count
  const renderIconColor = (count) => {
    if (count === 0) return '#C1C1C1';  
    if (count === 1) return '#F7C948';  
    if (count === 2) return '#FF7A00';  
    return '#ED0303';  
  };


  // Display containers in descending offense counts order
  const sortedSubcategories = Object.keys(subcategories).sort(
    (a, b) => Object.keys(subcategories[b]).length - Object.keys(subcategories[a]).length
  );
  

  // Show loading spinner when data is being fetched
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "50px", height: "50px", border: "6px solid #f3f3f3", borderTop: "6px solid #a9a9a9", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  

return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', marginLeft: '90px' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
       {sortedSubcategories.map((subcategoryName) => (
          <div key={subcategoryName} style={{ width: '520px', backgroundColor: 'white', border: '1px solid #818181', borderRadius: '5px', padding: '20px', cursor: 'pointer', overflowX: 'hidden', overflow: 'visible' }}>
            <h3 style={{ color: '#242424', fontSize: '16px', fontWeight: '500', margin: '0 0 15px 0' }}> {subcategoryName} </h3>
            <div style={{ marginLeft: '30px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
              {Object.entries(subcategories[subcategoryName]).map(
                ([offenseId, count], index) => (
                  <div key={offenseId}
                    style={{ position: 'relative', display: 'inline-block', textAlign: 'center' }}
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
                    <div style={{ fontSize: '50px', color: renderIconColor(count), cursor: 'pointer' }}>
                      {offenseIconMap[offenseId] || <FaExclamationCircle />} 
                    </div>
  
                    {/* Tooltip for offense name and count */}
                    <div
                      className="tooltip-content"
                      style={{ zIndex: 9999, transform: 'none', position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'black', backgroundColor: '#D9D9D9', border: '1px solid #808080',
                        padding: '10px', width: '300px', borderRadius: '5px', visibility: 'hidden', opacity: 0, transition: 'visibility 0s, opacity 0.3s linear', zIndex: 10, pointerEvents: 'none', fontSize: '14px', fontWeight: 'normal' }}>
                      <p style={{ margin: '0', fontSize: '14px' }}>
                        {offenseNames[offenseId] || 'Unknown Offense'}: {count}
                      </p>
                    </div>
                  </div>
                )
              )}
              {/* Fill remaining spaces with empty divs to ensure 5 items per container */}
              {Object.entries(subcategories[subcategoryName]).length < 5 &&
                Array(5 - Object.entries(subcategories[subcategoryName]).length)
                  .fill(null)
                  .map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '50px' }}></div>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}  
  

export default MyRecordsVisual;
