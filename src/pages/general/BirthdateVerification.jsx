import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import osaMotto from '../../components/images/osa_motto.png'; // Importing the background image
import osaLogo from '../../components/images/osa_logo.png'; // Importing the profile image

const BirthdateVerification = () => {
    const navigate = useNavigate();
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fetch user's data from the backend
            const response = await fetchUserData();

            if (!response.birthdate) {
                throw new Error("User's birthdate not found");
            }

            // Format user's birthdate as month/day/year
            const formattedUserBirthdate = formatDate(response.birthdate);

            // Compare inputted birthdate with user's formatted birthdate
            if (month + '/' + day + '/' + year === formattedUserBirthdate) {
                // Birthdate matches user's birthdate, navigate to dashboard
                navigate('/dashboard');
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Birthdate verified successfully!',
                    confirmButtonColor: '#47B881',
                });
            } else {
                // Birthdate does not match user's birthdate, display an error message
                throw new Error("Birthdate doesn't match the user's birthdate");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to fetch user data',
                confirmButtonColor: '#F27474',
            });
        }
    };

    const fetchUserData = async () => {
        try {
            // Make an API request to fetch user data
            const response = await fetch('http://localhost:3001/students', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary authorization headers (e.g., JWT token)
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            return response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    return (
        <div style={{ backgroundImage: `url(${osaMotto})`, backgroundSize: '100% 100%', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="wrapper" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '500px', marginLeft: '600px', marginRight: '10px', marginTop: '50px' }}>
                <div className="bg-green" style={{ backgroundColor: '#134E0F', width: '390px', height: '380px', padding: '20px', borderRadius: '20px', position: 'relative' }}>
                    <div className="white-circle" style={{ width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="profile-image" style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)' }}>
                        <img src={osaLogo} alt="OSA Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="h4 text-center pt-4" style={{ fontFamily: 'Inter', fontWeight: '900', fontSize: '35px', color: '#FFFFFF', marginTop: '50px' }}>Verify Account</div>
                    <h2 className="title" style={{ fontFamily: 'Poppins', fontWeight: '800', fontSize: '18px', color: '#FFFFFF', marginTop: '20px', marginBottom: '10px', marginLeft: '13px' }}>Date of Birth</h2>
                    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '13px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="dropdown-container">
                                    <label htmlFor="month" className="dropdown-label" style={{ color: '#FFFFFF', marginBottom: '5px' }}>Month:</label>
                                    <select id="month" className="dropdown" value={month} onChange={(e) => setMonth(e.target.value)} required style={{ backgroundColor: '#FFFFFF', color: '#134E0F', boxShadow: 'inset 0px 0px 5px 2px rgba(0, 0, 0, 0.2)', paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <option value=""></option>
                                        {months.map((month, index) => (
                                            <option key={index} value={String(index + 1).padStart(2, '0')}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="dropdown-container">
                                    <label htmlFor="day" className="dropdown-label" style={{ color: '#FFFFFF', marginBottom: '5px' }}>Day:</label>
                                    <select id="day" className="dropdown" value={day} onChange={(e) => setDay(e.target.value)} required style={{ backgroundColor: '#FFFFFF', color: '#134E0F', boxShadow: 'inset 0px 0px 5px 2px rgba(0, 0, 0, 0.2)', paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <option value=""></option>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="dropdown-container">
                                    <label htmlFor="year" className="dropdown-label" style={{ color: '#FFFFFF', marginBottom: '5px' }}>Year:</label>
                                    <select id="year" className="dropdown" value={year} onChange={(e) => setYear(e.target.value)} required style={{ backgroundColor: '#FFFFFF', color: '#134E0F', boxShadow: 'inset 0px 0px 5px 2px rgba(0, 0, 0, 0.2)', paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <option value=""></option>
                                        {Array.from({ length: 100 }, (_, i) => (
                                            <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-block text-center" style={{ marginTop: '15px', backgroundColor: '#FAD32E', borderRadius: '10px', color: 'white', padding: '10px 15px', width: '100%', fontWeight: '600', fontSize: '20px' }}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirthdateVerification;
