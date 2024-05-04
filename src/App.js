import React from 'react';
import { BrowserRouter as Router, Routes, Route,Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "./styles/tailwind.css";
import "./styles/index.css";
import "./styles/font.css";

import LoginSelectionPage from './pages/general/LoginSelection';
import UserInfo from './pages/general/UserInfo';
import StudentLogin from './pages/student/StudentLogin';
import EmployeeLogin from './pages/employees/EmployeeLogin';
import AdminLogin from './pages/administrator/AdminLogin';


import AdminNavigation from './pages/administrator/AdminNavigation';
import AdminDashboard from './pages/administrator/AdminDashboard';
import AdminUserManagement from './pages/administrator/AdminUserManagement';
import AdminRecordManagement from './pages/administrator/AdminRecordManagement';
import AdminReportManagement from './pages/administrator/AdminReportManagement';
import AdminLoginHistory from './pages/administrator/AdminLoginHistory';
import AdminUserHistory from './pages/administrator/AdminUserHistory';
import AdminAuditTrail from './pages/administrator/AdminAuditTrail';
import AdminSettings from './pages/administrator/AdminSettings';

import CoordinatorNavigation from './pages/osa coordinator/CoordinatorNavigation';
import CoordinatorDashboard from './pages/osa coordinator/CoordinatorDashboard';
import CoordinatorStudentRecords from './pages/osa coordinator/CoordinatorStudentRecords';
import CoordinatorIncidentReports from './pages/osa coordinator/CoordinatorIncidentReports'
import CoordinatorOnlineClearance from './pages/osa coordinator/CoordinatorOnlineClearance';
import CoordinatorViolations from './pages/osa coordinator/CoordinatorViolations';
import CoordinatorAnnouncements from './pages/osa coordinator/CoordinatorAnnouncements';
import CoordinatorSettings from './pages/osa coordinator/CoordinatorSettings';

import StudentNavigation from './pages/student/StudentNavigation';
import StudentMyRecords from './pages/student/StudentMyRecords';

import StudentRecords from './pages/corefunctions/StudentRecords';
import IndividualStudentRecord from './pages/corefunctions/IndividualStudentRecord';
import UniformDefiance from './pages/corefunctions/UniformDefiance';
import IncidentReport from './pages/corefunctions/IncidentReport'
import Violations from './pages/corefunctions/Violations';

import UserRegistration from './pages/administrator/UserRegistration'
import LandingPage from './pages/general/LandingPage';
import BirthdateVerification from './pages/general/BirthdateVerification';

import Handbook from './pages/general/Handbook';
import Legislations from './pages/general/Legislations';
import AboutAndContact from './pages/general/AboutAndContact';
import Settings from './pages/general/Settings';
function App() {
  return (
    <>
      <Router>
   
        <Container>
          <Row>
            <Col md={12}>
              <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login-selection' element={<LoginSelectionPage/>} /> 
                <Route path='/birthdate-verification' element={<BirthdateVerification/>} /> 
                <Route path='/student-login' element={<StudentLogin />} />
                <Route path='/employee-login' element={<EmployeeLogin />} />
                <Route path='/admin-login' element={<AdminLogin />} />

                <Route path='/studentrecords' element={<StudentRecords />} />
                <Route path='/uniformdefiance' element={<UniformDefiance />} />
                <Route path='/individualstudentrecord' element={<IndividualStudentRecord />} />
                <Route path='/incidentreport' element={<IncidentReport />} />
                <Route path='/violations' element={<Violations />} />

                <Route path='/handbook' element={<Handbook />} />
                <Route path='/legislations' element={<Legislations />} />
                <Route path='/aboutcontact' element={<AboutAndContact />} />
                <Route path='/settings' element={<Settings />} />

          
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
                <Route path='/user-registration' element={<UserRegistration />} />

                <Route path='/coordinator-dashboard' element={<CoordinatorDashboard />} />
                <Route path='/coordinator-studentrecords' element={<CoordinatorStudentRecords />} />
                <Route path='/coordinator-incidentreports' element={<CoordinatorIncidentReports />} />
                <Route path='/coordinator-onlineclearance' element={<CoordinatorOnlineClearance />} />
                <Route path='/coordinator-violations' element={<CoordinatorViolations />} />
                <Route path='/coordinator-announcements' element={<CoordinatorAnnouncements />} />
                <Route path='/coordinator-settings' element={<CoordinatorSettings />} />

                <Route path='/student-myrecords' element={<StudentMyRecords />} />

                
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </>
  );
}

export default App;
