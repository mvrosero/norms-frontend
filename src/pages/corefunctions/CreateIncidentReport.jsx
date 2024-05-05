import React, { useState } from 'react';

function Tab({ label, onClick, isActive, hasNext }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '10px 20px',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid #007bff' : 'none',
        color: isActive ? 'white' : '#717171', // Adjusted text color for active/inactive tab
        backgroundColor: isActive ? '#006533' : '#DADADA', // Adjusted color for active/inactive tab
        fontWeight: isActive ? 'bold' : 'normal',
        border: isActive ? '1px solid #006533' : '1px solid #818181', // Border color for active/inactive tab
        borderRadius: hasNext ? '0px 300px 0px 0' : '0px', // Rounded border for the last tab
        marginRight: '-32px', // Overlap tabs
        zIndex: isActive ? 1 : 0, // Ensure active tab overlaps others
        width: '120%', // Make tabs longer
        fontFamily: 'Inter',
        letterSpacing: '1px',
      }}
    >
      {label}
    </div>
  );
}

function CreateIncidentReport() {
    const [activeTab, setActiveTab] = useState(1);
    const [reportTitle, setReportTitle] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [incidentDate, setIncidentDate] = useState(''); // Define incidentDate state variable
    const [incidentTime, setIncidentTime] = useState(''); // Define incidentTime state variable
    const [incidentLocation, setIncidentLocation] = useState(''); // Define incidentLocation state variable
    const [reporter, setReporter] = useState('');
    const [victim, setVictim] = useState('');
    const [offender, setOffender] = useState('');
    const [witnesses, setWitnesses] = useState('');
  

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const handleCancel = () => {
    // Add logic to handle cancellation
  };

  return (
    <div style={{ maxWidth: '351px', margin: '0px 0px 0px 70px', padding: '0px' }}>
      <h2 style={{ fontSize: '30px', fontWeight: '900', fontFamily: 'Poppins', color: '#134E0F', padding: '15px 0px 15px 0px', marginBottom: '20px' }}>Create Incident Report</h2>
      <div style={{ whiteSpace: 'nowrap', backgroundColor: '#F4F3F3', paddingTop: '0px', textAlign: 'center', margin: '-20px 0px 0px 0px' }}>
        <Tab
          label="Incident Details"
          onClick={() => handleTabClick(1)}
          isActive={activeTab === 1}
          hasNext={true}
        />
        <Tab
          label="Incident Date and Location"
          onClick={() => handleTabClick(2)}
          isActive={activeTab === 2}
          hasNext={true}
        />
        <Tab
          label="Incident Participants"
          onClick={() => handleTabClick(3)}
          isActive={activeTab === 3}
          hasNext={false}
        />
      </div>

      <div style={{ width: '1200px', height: '510px', border: '1px solid #ddd', backgroundColor: '#F4F3F3', padding: '20px', borderRadius: '0 5px 5px 5px', marginTop: '-20px' }}>
        
      {activeTab === 1 && (
        <div>
            <h3 style={{ color: 'black', fontFamily: 'Poppins', textAlign: 'center', fontSize: '40px', fontWeight: '900', margin: '30px' }}>INCIDENT DETAILS</h3>
            <form onSubmit={handleSubmit} >
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="reportTitle" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Report Title:</label>
                <input
                type="text"
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="reportDescription" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Report Description:</label>
                <textarea
                id="reportDescription"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="reportFile" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Upload File:</label>
                <input
                type="file"
                id="reportFile"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
                />
            </div>
            <div style={{ position: 'absolute', bottom: '40px', right: '50px', textAlign: 'right' }}>
                <button type="button" onClick={handleCancel} style={{ padding: '8px 30px', fontSize: '20px', backgroundColor: '#8C8C8C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginRight: '5px', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ marginLeft: '5px', padding: '8px 40px', fontSize: '20px', backgroundColor: '#DAC50C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
            </div>
            </form>
        </div>
        )}

{activeTab === 2 && (
  <div>
    <h3 style={{ color: 'black', fontFamily: 'Poppins', textAlign: 'center', fontSize: '40px', fontWeight: '900', margin: '30px' }}>INCIDENT DATE AND LOCATION</h3>
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="incidentDate" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Date of Incident:</label>
        <input
          type="date"
          id="incidentDate"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="incidentTime" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Time of Incident:</label>
        <input
          type="time"
          id="incidentTime"
          value={incidentTime}
          onChange={(e) => setIncidentTime(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="incidentLocation" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Location:</label>
        <input
          type="text"
          id="incidentLocation"
          value={incidentLocation}
          onChange={(e) => setIncidentLocation(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
        <div style={{ position: 'absolute', bottom: '40px', right: '50px', textAlign: 'right' }}>
                <button type="button" onClick={handleCancel} style={{ padding: '8px 30px', fontSize: '20px', backgroundColor: '#8C8C8C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginRight: '5px', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ marginLeft: '5px', padding: '8px 40px', fontSize: '20px', backgroundColor: '#DAC50C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
        </div>
    </form>
  </div>
)}


{activeTab === 3 && (
  <div>
    <h3 style={{ color: 'black', fontFamily: 'Poppins', textAlign: 'center', fontSize: '40px', fontWeight: '900', margin: '30px 30px 20px 30px' }}>INCIDENT PARTICIPANTS</h3>
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="reporter" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Reporter:</label>
        <input
          type="text"
          id="reporter"
          value={reporter}
          onChange={(e) => setReporter(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="victim" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Victim:</label>
        <input
          type="text"
          id="victim"
          value={victim}
          onChange={(e) => setVictim(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="offender" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Offender:</label>
        <input
          type="text"
          id="offender"
          value={offender}
          onChange={(e) => setOffender(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="witnesses" style={{ fontWeight: 'bold', fontFamily: 'Inter', fontSize: '18px', marginBottom: '5px' }}>Witnesses:</label>
        <input
          type="text"
          id="witnesses"
          value={witnesses}
          onChange={(e) => setWitnesses(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ position: 'absolute', bottom: '20px', right: '50px', textAlign: 'right' }}>
        <button type="button" onClick={handleCancel} style={{ padding: '8px 30px', fontSize: '20px', backgroundColor: '#8C8C8C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginRight: '5px', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ marginLeft: '5px', padding: '8px 40px', fontSize: '20px', backgroundColor: '#DAC50C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Submit</button>
      </div>
    </form>
  </div>
)}

      </div>
    </div>
  );
}

export default CreateIncidentReport;
