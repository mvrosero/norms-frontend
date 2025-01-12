import React from "react";
import { GrSystem } from "react-icons/gr";
import styled from '@emotion/styled';


const ViewButton = styled.button`
  border-radius: 20px;
  background: linear-gradient(45deg, #015901, #006637, #4aa616);
  color: white;
  border: none;
  padding: 5px 30px;
  margin-top: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  &:hover {
    background: linear-gradient(45deg, #4aa616, #006637, #015901);
  }
`;

const AccountLimited = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100vh", backgroundColor: "#f8f9fa", textAlign: "center", fontFamily: "'Poppins', sans-serif", color: "#0D4809" }}>
      
      {/* Title */}
      <h1 style={{ fontSize: "40px", marginBottom: "10px", color: "#0D4809", fontWeight: "bold" }}>
            Account Access Restricted
      </h1>

      {/* Icon */}
      <GrSystem style={{ fontSize: "150px", color: "#0D4809", marginTop: "40px", marginBottom: "40px" }}/>

      {/* Main Message */}
      <p style={{ fontSize: "18px", marginBottom: "15px", lineHeight: "24px" }} >
            Your account is currently inactive, and access to system features is
            limited.
      </p>

      {/* Call to Action */}
      <p style={{ fontSize: "16px", marginBottom: "20px", lineHeight: "22px" }}
      >
            Please contact the system administrator for assistance in resolving this
            issue.
      </p>

      {/* Email Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* Email Support Button */}
        <ViewButton onClick={() => window.open( "https://mail.google.com/mail/?view=cm&fs=1&to=support@norms.com","_blank" )}>
            support@norms.com
        </ViewButton>
      </div>
    </div>
  );
};


export default AccountLimited;
