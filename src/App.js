import React from 'react';
import { BrowserRouter as Router, Routes, Route,Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "./styles/tailwind.css";
import "./styles/index.css";
import "./styles/font.css";

/*general*/
import BirthdateVerification from './pages/general/BirthdateVerification';
import Handbook from './pages/general/Handbook';
import LandingPage from './pages/general/LandingPage';

/*login*/
import LoginSelectionPage from './pages/general/LoginSelection';
import AdminLogin from './pages/administrator/AdminLogin';
import EmployeeLogin from './pages/employees/EmployeeLogin';
import StudentLogin from './pages/student/StudentLogin';

/*user registration*/
import EmployeeRegistration from './pages/administrator/EmployeeRegistration';
import StudentRegistration from './pages/administrator/StudentRegistration';

/*administrator*/
import AdminDashboard from './pages/administrator/AdminDashboard';
import AdminUserManagement from './pages/administrator/AdminUserManagement';
import AdminSettings from './pages/administrator/AdminSettings';

/*osa coordinator*/
import CoordinatorDashboard from './pages/osa coordinator/CoordinatorDashboard';
import CoordinatorStudentRecords from './pages/osa coordinator/CoordinatorStudentRecords';
import CoordinatorViolations from './pages/osa coordinator/CoordinatorViolations';
import CoordinatorAnnouncements from './pages/osa coordinator/CoordinatorAnnouncements';
import CoordinatorSettings from './pages/osa coordinator/CoordinatorSettings';
import IndividualStudentRecord from './pages/osa coordinator/IndividualStudentRecord';

/*student*/
import StudentAboutAndContact from './pages/student/StudentAboutAndContact';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentLegislations from './pages/student/StudentLegislation';
import StudentMyRecords from './pages/student/StudentMyRecords';
import StudentSettings from './pages/student/StudentSettings';



function App() {
  return (
    <>
      <Router>
   
        <Container>
          <Row>
            <Col md={12}>
              <Routes>
                <Route path="/birthdate-verification/:id" element={<BirthdateVerification />} />
                <Route path='/handbook' element={<Handbook />} />
                <Route path='/' element={<LandingPage />} />

                <Route path='/login-selection' element={<LoginSelectionPage/>} /> 
                <Route path='/admin-login' element={<AdminLogin />} />
                <Route path='/employee-login' element={<EmployeeLogin />} />
                <Route path='/student-login' element={<StudentLogin />} />

                <Route path='/register-employee' element={<EmployeeRegistration />} />
                <Route path='/register-student' element={<StudentRegistration />} />

                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/admin-usermanagement' element={<AdminUserManagement />} />
                <Route path='/admin-settings' element={<AdminSettings />} />

                <Route path='/coordinator-dashboard' element={<CoordinatorDashboard />} />
                <Route path='/coordinator-studentrecords' element={<CoordinatorStudentRecords />} />
                <Route path='/coordinator-violations' element={<CoordinatorViolations />} />
                <Route path='/coordinator-announcements' element={<CoordinatorAnnouncements />} />
                <Route path='/coordinator-settings' element={<CoordinatorSettings />} />
                <Route path='/individualstudentrecord/:student_idnumber' element={<IndividualStudentRecord />} />

                
                <Route path='/aboutcontact' element={<StudentAboutAndContact/>} />
                <Route path='/student-announcements' element={<StudentAnnouncements />} />
                <Route path='/legislations' element={<StudentLegislations />} />
                <Route path='/student-myrecords' element={<StudentMyRecords />} />
                <Route path='/student-settings' element={<StudentSettings />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </>
  );
}

export default App;
