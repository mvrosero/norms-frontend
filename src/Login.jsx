import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Row, Col, Nav } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import {jwtDecode} from 'jwt-decode'; 



export const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'))
                setUser(response.data);
                navigate("/dashboard");
            } catch (error) {
                navigate('/login');
            }
        };
        fetchUser();
    }, []);

    const [user_number, setUserNumber] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const handleLogin = async (e) => {
        try {
            const response = await axios.post('https://test-backend-api-z3sd.onrender.com/login', {
                user_number,
                password,
            });

            localStorage.setItem("token", JSON.stringify(response));
            navigate('/dashboard');
        } catch (error) {
            console.error('login failed', error);
        }
    };

    return (
        <>
            <div className='container'>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={6} xs={12}>
                        <input type="user_id" value={user_number} onChange={(e) => setUserNumber(e.target.value)} />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={handleLogin}>Login</button>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Login;