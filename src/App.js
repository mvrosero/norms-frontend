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
import CoordinatorForReviewIncident from './pages/osa coordinator/CoordinatorForReviewIncident';
import CoordinatorForRecordIncident from './pages/osa coordinator/CoordinatorForRecordIncident';
import CoordinatorOnlineClearance from './pages/osa coordinator/CoordinatorOnlineClearance';
import CoordinatorPendingClearance from './pages/osa coordinator/CoordinatorPendingClearance';
import CoordinatorViolations from './pages/osa coordinator/CoordinatorViolations';
import CoordinatorAnnouncements from './pages/osa coordinator/CoordinatorAnnouncements';
import CoordinatorSettings from './pages/osa coordinator/CoordinatorSettings';

import OSAStaffStudentRecords from './pages/osa staff/OSAStaffStudentRecords';
import OSAStaffUniformDefiance from './pages/osa staff/OSAStaffUniformDefiance';
import OSAStaffDefianceSlip from './pages/osa staff/OSAStaffDefianceSlip';

import NCFStaffDashboard from './pages/ncf staff/NCFStaffDashboard';
import NCFStaffClearance from './pages/ncf staff/NCFStaffClearance';
import NCFStaffSign from './pages/ncf staff/NCFStaffSign';
import NCFStaffUniformDefiance from './pages/ncf staff/NCFStaffUniformDefiance';

import SecurityUniformDefiance from './pages/security personnel/SecurityUniformDefiance';
import StudentNavigation from './pages/student/StudentNavigation';
import StudentMyRecords from './pages/student/StudentMyRecords';
import ClearanceSelection from './pages/student/StudentClearanceSelection';
import StudentOnlineClearance from './pages/student/StudentOnlineClearance';
import StudentRequestClearance from './pages/student/StudentRequestClearance';

import StudentRecords from './pages/corefunctions/StudentRecords';
import IndividualStudentRecord from './pages/corefunctions/IndividualStudentRecord';
import UniformDefiance from './pages/corefunctions/UniformDefiance';
import IncidentReport from './pages/corefunctions/IncidentReport'
import Violations from './pages/corefunctions/Violations';

import LandingPage from './pages/general/LandingPage';
import BirthdateVerification from './pages/general/BirthdateVerification';
import EmployeeRegistration from './pages/administrator/EmployeeRegistration';
import StudentRegistration from './pages/administrator/StudentRegistration';
import CreateIncidentReport from './pages/corefunctions/CreateIncidentReport';

import Handbook from './pages/general/Handbook';
import Legislations from './pages/general/Legislations';
import Announcements from './pages/general/Announcements';
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

                <Route path='/register-employee' element={<EmployeeRegistration />} />
                <Route path='/register-student' element={<StudentRegistration />} />

                <Route path='/studentrecords' element={<StudentRecords />} />
                <Route path='/uniformdefiance' element={<UniformDefiance />} />
                <Route path='/individualstudentrecord' element={<IndividualStudentRecord />} />
                <Route path='/incidentreport' element={<IncidentReport />} />
                <Route path='/violations' element={<Violations />} />

                <Route path='/announcements' element={<Announcements />} />
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

                <Route path='/coordinator-dashboard' element={<CoordinatorDashboard />} />
                <Route path='/coordinator-studentrecords' element={<CoordinatorStudentRecords />} />
                <Route path='/coordinator-incidentreports' element={<CoordinatorIncidentReports />} />
                <Route path='/coordinator-reviewincidentreport' element={<CoordinatorForReviewIncident />} />
                <Route path='/coordinator-recordincidentreport' element={<CoordinatorForRecordIncident />} />
                <Route path='/coordinator-onlineclearance' element={<CoordinatorOnlineClearance />} />
                <Route path='/coordinator-pendingclearance' element={<CoordinatorPendingClearance />} />
                <Route path='/coordinator-violations' element={<CoordinatorViolations />} />
                <Route path='/coordinator-announcements' element={<CoordinatorAnnouncements />} />
                <Route path='/coordinator-settings' element={<CoordinatorSettings />} />

                <Route path='/osastaff-studentrecords' element={<OSAStaffStudentRecords />} />
                <Route path='/osastaff-uniformdefiance' element={<OSAStaffUniformDefiance />} />
                <Route path='/osastaff-defianceslip' element={<OSAStaffDefianceSlip />} />

                <Route path='/ncfstaff-dashboard' element={<NCFStaffDashboard />} />
                <Route path='/ncfstaff-onlineclearance' element={<NCFStaffClearance />} />
                <Route path='/ncfstaff-signclearances' element={<NCFStaffSign />} />
                <Route path='/ncfstaff-uniformdefiance' element={<NCFStaffUniformDefiance />} />

                <Route path='/security-uniformdefiance' element={<SecurityUniformDefiance />} />

                <Route path='/student-myrecords' element={<StudentMyRecords />} />
                <Route path='/clearance-selection' element={<ClearanceSelection />} />
                <Route path='/student-myclearances' element={<StudentOnlineClearance />} />
                <Route path='/clearance-request' element={<StudentRequestClearance />} />

                <Route path='/create-incidentreport' element={<CreateIncidentReport />} />

                
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </>
  );
}

export default App;
