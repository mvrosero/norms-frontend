import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import './Navbar.=-'; // Import the CSS file

const NavbarComponent = ({ user, handleLogout }) => {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="#home">ReactJS Web Application</Navbar.Brand>
        <Nav className='me-auto'>
          <Nav.Link href="#home" className="nav-link-custom">Home</Nav.Link>
          <Nav.Link href="#records" className="nav-link-custom">Records</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>
            {user ? user.employee_number : 'id'} {user ? user.name : 'name'}
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
