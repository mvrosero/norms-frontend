import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";

export default function AdminAccountHistory() {
  const [accountHistory, setAccountHistory] = useState(null);
  const [userHistories, setUserHistories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user_id } = useParams();
  console.log("User ID from URL:", user_id); 

  // Generate action sentences for the timeline
  const generateActionSentence = (history) => {
    const changes = [];

    if (history.old_department_id !== history.new_department_id) {
      changes.push(`The department was changed from ${history.old_department_name} to ${history.new_department_name} by ${history.updated_by}.`.replace(/\s+\./, '.'));
    }
    if (history.old_program_id !== history.new_program_id) {
      changes.push(`The program was changed from ${history.old_program_name} to ${history.new_program_name} by ${history.updated_by}.`.replace(/\s+\./, '.'));
    }
    if (history.old_year_level !== history.new_year_level) {
      changes.push(`The year level was changed from ${history.old_year_level} to ${history.new_year_level} by ${history.updated_by}.`.replace(/\s+\./, '.'));
    }
    if (history.old_status !== history.new_status) {
      changes.push(`The status was changed from ${history.old_status} to ${history.new_status} by ${history.updated_by}.`.replace(/\s+\./, '.'));
    }    
    if (history.old_batch !== history.new_batch) {
      changes.push(`The batch was changed from ${history.old_batch} to ${history.new_batch} by ${history.updated_by}.`.replace(/\s+\./, '.'));
    }
    if (history.old_role_id !== history.new_role_id) {
      changes.push(`The role was changed from ${history.old_role_name} to ${history.new_role_name} by ${history.updated_by}.`.replace(/\s+\./, '.'));
    }
    const actionSentence = changes.join(' ') || 'No changes recorded';
    return `${actionSentence}`;
  };


  useEffect(() => {
    const fetchAccountHistory = async () => {
      try {
        const response = await fetch(`https://test-backend-api-2.onrender.com/account-history/${user_id}`);
        console.log("API Response:", response); 
        if (!response.ok) {
          throw new Error('Error fetching account history');
        }
        const data = await response.json();
        console.log("Fetched Data:", data); 
        setAccountHistory(data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    const fetchUserHistories = async () => {
      try {
        const response = await fetch(`https://test-backend-api-2.onrender.com/histories/${user_id}`);
        console.log("User History Response:", response);
        if (!response.ok) {
          throw new Error('Error fetching user histories');
        }
        const data = await response.json();
        console.log("Fetched User Histories:", data);
        setUserHistories(data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      }
    };
    fetchAccountHistory();
    fetchUserHistories();
  }, [user_id]);


  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ width: "50px", height: "50px", border: "6px solid #f3f3f3", borderTop: "6px solid #a9a9a9", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


return (
  <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
    <AdminNavigation />
    <AdminInfo />

      {/* Title Section */}
      <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
        <h6 style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginLeft: '30px' }}>
          Account History
        </h6>
      </div>

      {/* Breadcrumbs */}
      <nav style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '100px', textAlign: 'left' }}>
        <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex', justifyContent: 'flex-start' }}>
          <li style={{ marginRight: '5px' }}>
            <Link to="/admin-usermanagement" style={{ textDecoration: 'none', color: '#0D4809' }}>
              User Management
            </Link>
          </li>
          <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
          <li style={{ marginLeft: '5px', color: '#000' }}>Account History</li>
        </ol>
      </nav>

      {/* Timeline Section */}
      {accountHistory && accountHistory.length > 0 ? (
        <div style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '50px', marginLeft: '170px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', position: 'relative', marginTop: '40px' }}>
            {/* Left Section: Timeline Circles and Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '40px' }}>
              {/* Account Created Milestone */}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', border: '4px solid #0D4806', backgroundColor: 'white', marginBottom: '10px', position: 'absolute', top: '0'
              }}></div>
              {/* Line connecting created and updated */}
              <div 
                  style={{ height: '60px', width: '2px', backgroundColor: '#0D4809', marginBottom: '10px', position: 'absolute', top: '20px' }}></div>

              {/* Account Updated Milestone */}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', border: '4px solid #0D4806', backgroundColor: 'white', marginBottom: '10px', position: 'absolute', top: '80px'
              }}></div>

              {/* Action Sentences Circles and Lines */}
              {userHistories && userHistories.length > 0 && (
                <React.Fragment>
                  <div style={{ height: '60px', width: '2px', backgroundColor: '#0D4809', marginBottom: '10px', position: 'absolute', top: '100px' }}></div>
                
                  {/* Render Action Circles and Lines */}
                  {userHistories.map((history, index) => (
                    <React.Fragment key={index}>
                      {/* Action Circle */}
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', border: '4px solid #0D4806', backgroundColor: 'white', marginBottom: '10px', position: 'absolute', top: `${(index + 2) * 80}px`
                          }}></div>
                              {/* Action Line, but conditionally render the line only if it's not the last action */}
                              {index < userHistories.length - 1 && (
                                <div 
                                  style={{
                                    height: '60px', width: '2px', backgroundColor: '#0D4809', marginBottom: '10px', position: 'absolute', top: `${(index + 2) * 80 + 20}px`
                                  }}></div>
                              )}
                            </React.Fragment>
                          ))}
                    </React.Fragment>
                  )}
                </div>

              {/* Right Section: Milestone Texts */}
              <div style={{ flex: 1 }}>
                {/* Account Updated Text */}
                <div style={{ top: '100px' }}>
                  <p style={{ fontSize: '16px', color: '#000000', textAlign: 'left', marginLeft: '10px' }}>
                    The account was last updated on {new Date(accountHistory[0].last_updated).toLocaleString('en-US', 
                    { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}.
                  </p>
                </div>

                {/* Generated Action Sentences */}
                {userHistories && userHistories.length > 0 && userHistories.map((history, index) => (
                  <div key={index} style={{ marginTop: '60px' }}>
                    <p style={{ fontSize: '16px', color: '#000000', textAlign: 'left', marginLeft: '10px' }}>
                      {generateActionSentence(history)}
                    </p>
                  </div>
                ))}

                {/* Account Created Text */}
                <div style={{ marginTop: '60px' }}>
                  <p style={{ fontSize: '16px', color: '#000000', textAlign: 'left', marginLeft: '10px' }}>
                    The account was created on {new Date(accountHistory[0].created_at).toLocaleString('en-US', 
                    { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })} 
                    {accountHistory[0].created_by && ` by ${accountHistory[0].created_by.trim()}`}.
                  </p>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <p>No account history available for this user.</p>
          )}
            </div>
          );
        }
