import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import Login from './Login';
import MainDashboard from './pages/MainDashboard/index';
import "./styles/tailwind.css";
import "./styles/index.css";
import "./styles/font.css";
function App() {
  return (
    <>
      <Router>
        <Container>
          <Row>
            <Col md={12}>
              <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<MainDashboard />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </>
  );
}

export default App;
