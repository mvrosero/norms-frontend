import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import AdminNavigation from "./AdminNavigation";
import UserInfo from "../general/UserInfo";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; 
import "../../pages/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faChartBar, faUser } from '@fortawesome/free-solid-svg-icons';

const StyledButton = styled(Button)`
  background-color: #006400!important;
  border-color: #0000ff!important;
  &:hover {
    background-color:#eee600!important;
    border-color: #0000ff!important;
  }
`;

const data = [
    { name: 'Jan', pv: 2400 },
    { name: 'Feb', pv: 1398 },
    { name: 'Mar', pv: 9800 },
    { name: 'Apr', pv: 3908 },
    { name: 'May', pv: 4800 },
    { name: 'Jun', pv: 3800 },
    { name: 'Jul', pv: 4300 },
    { name: 'Aug', pv: 3800 },
    { name: 'Sep', pv: 4300 },
    { name: 'Oct', pv: 3800 },
    { name: 'Nov', pv: 4300 },
    { name: 'Dec', pv: 3800 },
  ];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleRecordsClick = () => {
    navigate('/admin-recordmanagement'); // navigate to record management page
  };

  const handleReportsClick = () => {
    navigate('/admin-reportmanagement'); // navigate to record management page
  };

  const handleClearanceClick = () => {
    // todo: implement clearance functionality
  };

  return (
    <>
      <AdminNavigation />
      <UserInfo />
      <div className="buttons-container d-flex justify-content-center mt-4">
        <StyledButton
          variant="primary"
          onClick={handleRecordsClick}
          className="mr-3"
          style={{
            width: "200px",
            height: "100px",
            fontSize: "20px",
            marginRight: "20px",
            marginTop: "120px"
          }}
        >
          <FontAwesomeIcon icon={faFile} /> Records
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={handleReportsClick}
          className="mr-3"
          style={{
            width: "200px",
            height: "100px",
            fontSize: "20px",
            marginRight: "20px",
            marginTop: "120px"
          }}
        >
          <FontAwesomeIcon icon={faChartBar} /> Reports
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={handleClearanceClick}
          style={{
            width: "200px",
            height: "100px",
            fontSize: "20px",
            marginTop: "120px"
          }}
        >
          <FontAwesomeIcon icon={faUser} /> Clearance
        </StyledButton>
      </div>

      <div className="chart-container bg-white-A700 p-4">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#006400" />
        </BarChart>
      </div>
    </>
  );
}