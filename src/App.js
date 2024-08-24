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
import AccountSettings from './pages/general/AccountSettings';

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
import DepartmentUsersList from './pages/administrator/DepartmentUsersList';
import AdminSettings from './pages/administrator/AdminSettings';
import ManageDepartments from './pages/administrator/ManageDepartments';
import ManagePrograms from './pages/administrator/ManagePrograms';
import ManageAcademicYears from './pages/administrator/ManageAcademicYears';


/*osa coordinator*/
import CoordinatorDashboard from './pages/osa coordinator/CoordinatorDashboard';
import CoordinatorStudentRecords from './pages/osa coordinator/CoordinatorStudentRecords';
import CoordinatorUniformDefiance from './pages/osa coordinator/CoordinatorUniformDefiance';
import CoordinatorViolations from './pages/osa coordinator/CoordinatorViolations';
import CoordinatorAnnouncements from './pages/osa coordinator/CoordinatorAnnouncements';
import CoordinatorSettings from './pages/osa coordinator/CoordinatorSettings';
import UniformDefianceHistory from './pages/osa coordinator/UniformDefianceHistory';
import IndividualStudentRecord from './pages/osa coordinator/IndividualStudentRecord';
import IndividualUniformDefiance from './pages/osa coordinator/IndividualUniformDefianceTable';
import ManageCategories from './pages/osa coordinator/ManageCategories';
import ManageOffenses from './pages/osa coordinator/ManageOffenses';
import ManageSanctions from './pages/osa coordinator/ManageSanctions';

/*security personnel*/
import SecurityLandingPage from './pages/security/SecurityLandingPage';
import SecurityViewSlips from './pages/security/SecurityViewSlips';
import SecurityCreateSlip from './pages/security/SecurityCreateSlip';
import SecuritySettings from './pages/security/SecuritySettings';

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
                <Route path='/account-settings/:user_id' element={<AccountSettings />} />

                <Route path='/login-selection' element={<LoginSelectionPage/>} /> 
                <Route path='/admin-login' element={<AdminLogin />} />
                <Route path='/employee-login' element={<EmployeeLogin />} />
                <Route path='/student-login' element={<StudentLogin />} />

                <Route path='/register-employee' element={<EmployeeRegistration />} />
                <Route path='/register-student' element={<StudentRegistration />} />

                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/admin-usermanagement' element={<AdminUserManagement />} />
                <Route path="/admin-usermanagement/:department_code" element={<DepartmentUsersList />} />
                <Route path='/admin-settings' element={<AdminSettings />} />
                <Route path='/manage-departments' element={<ManageDepartments />} />
                <Route path='/manage-programs' element={<ManagePrograms />} />
                <Route path='/manage-academicyears' element={<ManageAcademicYears />} />

                <Route path='/coordinator-dashboard' element={<CoordinatorDashboard />} />
                <Route path='/coordinator-studentrecords' element={<CoordinatorStudentRecords />} />
                <Route path='/coordinator-uniformdefiance' element={<CoordinatorUniformDefiance />} />
                <Route path='/coordinator-violations' element={<CoordinatorViolations />} />
                <Route path='/coordinator-announcements' element={<CoordinatorAnnouncements />} />
                <Route path='/coordinator-settings' element={<CoordinatorSettings />} />
                <Route path='/uniformdefiance-history' element={<UniformDefianceHistory />} />
                <Route path='/individualstudentrecord/:student_idnumber' element={<IndividualStudentRecord />} />
                <Route path='/individualuniformdefiance/:student_idnumber' element={<IndividualUniformDefiance />} />
                <Route path='/manage-offenses' element={<ManageOffenses />} />
                <Route path='/manage-sanctions' element={<ManageSanctions />} />
                <Route path='/manage-categories' element={<ManageCategories />} />

                <Route path='/defiance-selection' element={<SecurityLandingPage />} />
                <Route path='/view-slips' element={<SecurityViewSlips />} />
                <Route path='/create-slip' element={<SecurityCreateSlip />} />
                <Route path='/security-settings' element={<SecuritySettings />} />

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
