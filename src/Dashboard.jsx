import React, { useEffect , useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import { jwtDecode } from 'jwt-decode';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "bootstrap/dist/css/bootstrap.css"
import { Link } from "react-router-dom"; 
import Nav from  'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import User from './User';


const Dashboard = () => {
    
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    /*verify if user in-session in localstorage*/
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'))
                /*setUser (response.data)*/

                const decoded_token = jwtDecode(response.data.token);
                /*console.log (decoded token)*/
                setUser(decoded_token);

            } catch (error) {

                navigate("/login");

            }
        };

        fetchUser();
    }, []);

    /*performs logout method*/
    const handleLogout = async () => {

        try {
            localStorage.removeItem('token');
            navigate("/login");

        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (

        <>
             <Navbar bg="primary" data-bs-theme="dark" expand="lg">
                <Container>
                   <Navbar.Brand href="#home"> ReactJS Web Application </Navbar.Brand>
                       <Nav className='me-auto'>
                          <Nav.Link className='text-decoration-none text-white'> Home </Nav.Link>
                          <Nav.Link className='text-decoration-none text-white'> Records </Nav.Link>
                       </Nav>
                     <Navbar.Toggle />
                       <Navbar.Collapse className='justify-content-end'>
                         <Navbar.Text>
                            {user? user.employee_number : 'id'} {user ? user.name : 'name'}
                            <Button variant="secondary" onClick={handleLogout}> Logout </Button>
                         </Navbar.Text>
                       </Navbar.Collapse>
                </Container>
             </Navbar>

            <div>

            {<User />}

            </div>
        </>
    );
};

export default Dashboard;