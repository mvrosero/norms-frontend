import React from 'react';
import OSAStaffNavigation from './OSAStaffNavigation';
import UserInfo from "../general/UserInfo";

export default function OSAStaffDefianceSlip() {
    return (
        <div>
            <OSAStaffNavigation />
            <UserInfo />
            <h2 style={{ fontSize: '30px', fontWeight: '900', fontFamily: 'Poppins', color: '#134E0F', padding: '15px 0px 15px 100px' }}>Uniform Defiance Slip</h2> 
            <div style={{ maxWidth: '1100px', marginLeft: '120px', padding: '20px' }}>
                {/* First rectangular component */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px', borderTop: '5px solid #134E0F', borderLeft: '1px solid #134E0F', borderRight: '1px solid #134E0F', borderBottom: '1px solid #134E0F', marginBottom: '20px', width: '100%', height: '200px', position: 'relative' }}>
                </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '5px', marginBottom: '30px', marginRight: '60px' }}>
                <button type="button" style={{ padding: '8px 40px', fontSize: '20px', backgroundColor: '#8C8C8C', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginRight: '5px', fontWeight: '600', width: '150px' }}>Reject</button>
                <button type="submit" style={{ padding: '8px 40px', fontSize: '20px', backgroundColor: '#000AFF', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Record</button>
            </div>
        </div>
    );
}
