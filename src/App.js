import React from 'react';
import { BrowserRouter as Router, Routes, Route,Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "./styles/tailwind.css";
import "./styles/index.css";
import "./styles/font.css";

import LoginSelectionPage from './pages/general/LoginSelection';
import StudentLogin from './pages/student/StudentLogin';
import EmployeeLogin from './pages/employees/EmployeeLogin';
import AdminLogin from './pages/administrator/AdminLogin';

import AdminNavigation from './pages/administrator/AdminNavigation';
import UserInfo from './pages/general/UserInfo';
import AdminDashboard from './pages/administrator/AdminDashboard';
import AdminUserManagement from './pages/administrator/AdminUserManagement';
import AdminRecordManagement from './pages/administrator/AdminRecordManagement';
import AdminReportManagement from './pages/administrator/AdminReportManagement';
import AdminLoginHistory from './pages/administrator/AdminLoginHistory';
import AdminUserHistory from './pages/administrator/AdminUserHistory';
import AdminAuditTrail from './pages/administrator/AdminAuditTrail';
import AdminSettings from './pages/administrator/AdminSettings';
import User from './User';
import MainDashboard from './pages/MainDashboard/index';
import Registration from './pages/Registration';
import WelcomePage from './pages/Home';
import BirthdateVerificationPage from './pages/general/BirthdateVerification';
function App() {
  return (
    <>
      <Router>
   
        <Container>
          <Row>
            <Col md={12}>
              <Routes>
                <Route path='/' element={<WelcomePage />} />
                <Route path='/login-selection' element={<LoginSelectionPage/>} /> {/* Make sure LoginSelectionPage is assigned here */}
                <Route path='/birthdate-verification' element={<BirthdateVerificationPage/>} /> {/* Make sure LoginSelectionPage is assigned here */}
                <Route path='/student-login' element={<StudentLogin />} />
                <Route path='/employee-login' element={<EmployeeLogin />} />
                <Route path='/admin-login' element={<AdminLogin />} />

              
                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/admin-usermanagement' element={<AdminUserManagement />} />
                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/admin-usermanagement' element={<AdminUserManagement />} />
                <Route path='/admin-recordmanagement' element={<AdminRecordManagement />} />
                <Route path='/admin-reportmanagement' element={<AdminReportManagement />} />
                <Route path='/admin-loginhistory' element={<AdminLoginHistory />} />
                <Route path='/admin-userhistory' element={<AdminUserHistory />} />
                <Route path='/admin-audittrail' element={<AdminAuditTrail />} />
                <Route path='/admin-settings' element={<AdminSettings />} />

                <Route path='/dashboard' element={<MainDashboard />} />
                <Route path='/registration' element={<Registration />} />

               
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </>
  );
}

export default App;
