import React from 'react';
import CoordinatorNavigation from './CoordinatorNavigation';
import UserInfo from "../general/UserInfo";

export default function CoordinatorForRecordIncident() {
    return (
        <div>
            <CoordinatorNavigation />
            <UserInfo />
            <h2 style={{ fontSize: '30px', fontWeight: '900', fontFamily: 'Poppins', color: '#134E0F', padding: '15px 0px 15px 100px' }}>View Incident Report</h2> 
            <div style={{ maxWidth: '1100px', marginLeft: '120px', padding: '20px' }}>
                {/* First rectangular component */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px', borderTop: '5px solid #134E0F', borderLeft: '1px solid #134E0F', borderRight: '1px solid #134E0F', borderBottom: '1px solid #134E0F', marginBottom: '20px', width: '100%', height: '200px', position: 'relative' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins', color: 'black', position: 'absolute', top: '20px', left: '20px', margin: '0' }}>Incident Details</h3>
                    {/* Content for first rectangular component */}
                </div>
                {/* Second rectangular component */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px', borderTop: '5px solid #134E0F', borderLeft: '1px solid #134E0F', borderRight: '1px solid #134E0F', borderBottom: '1px solid #134E0F', marginBottom: '20px', width: '100%', height: '200px', position: 'relative' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins', color: 'black', position: 'absolute', top: '20px', left: '20px', margin: '0' }}>Incident Date and Location</h3>
                    {/* Content for second rectangular component */}
                </div>
                {/* Third rectangular component */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px', borderTop: '5px solid #134E0F', borderLeft: '1px solid #134E0F', borderRight: '1px solid #134E0F', borderBottom: '1px solid #134E0F', width: '100%', height: '200px', position: 'relative' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Poppins', color: 'black', position: 'absolute', top: '20px', left: '20px', margin: '0' }}>Incident Participants</h3>
                    {/* Content for third rectangular component */}
                </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '5px', marginBottom: '30px', marginRight: '60px' }}>
                <button type="button" style={{ padding: '8px 40px', fontSize: '20px', backgroundColor: '#8C8C8C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginRight: '5px', fontWeight: '600', width: '150px' }}>Reject</button>
                <button type="submit" style={{ padding: '8px 40px', fontSize: '20px', backgroundColor: '#000AFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Record</button>
            </div>
        </div>
    );
}
