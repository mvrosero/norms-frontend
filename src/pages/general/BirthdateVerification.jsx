import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import osaMotto from '../../components/images/osa_motto.png';

const BirthdateVerification = () => {
    const navigate = useNavigate();
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userId = localStorage.getItem('user_id'); // Get the logged-in user's ID
            if (!userId) {
                throw new Error('User ID not found in local storage');
            }

            // Format the birthdate as yyyy-mm-dd
            const formattedBirthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            // Fetch user info
            const response = await axios.get(`https://test-backend-api-2.onrender.com/user/${userId}`);
            const userInfo = response.data;

            if (userInfo.birthdate === formattedBirthdate) {
                navigate('/dashboard');
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Birthdate verified successfully!',
                    confirmButtonColor: '#47B881',
                });
            } else {
                throw new Error("Birthdate doesn't match the user's birthdate");
            }
        } catch (error) {
            console.error('Error verifying birthdate:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to verify birthdate',
                confirmButtonColor: '#F27474',
            });
        }
    };

    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= 31; i++) {
            days.push(
                <option key={i} value={i < 10 ? `0${i}` : `${i}`}>{i < 10 ? `0${i}` : `${i}`}</option>
            );
        }
        return days;
    };

    const renderYears = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 100; i--) {
            years.push(
                <option key={i} value={i}>{i}</option>
            );
        }
        return years;
    };

    return (
        <div style={{ backgroundImage: `url(${osaMotto})`, backgroundSize: '100% 100%', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="wrapper" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '500px', marginLeft: '600px', marginRight: '10px', marginTop: '50px' }}>
                <div className="bg-green" style={{ backgroundColor: '#134E0F', width: '390px', height: '380px', padding: '20px', borderRadius: '20px', position: 'relative' }}>
                    <div className="h4 text-center pt-4" style={{ fontFamily: 'Inter', fontWeight: '900', fontSize: '35px', color: '#FFFFFF', marginTop: '50px' }}>Verify Birthdate</div>
                    <h2 className="title" style={{ fontFamily: 'Poppins', fontWeight: '800', fontSize: '18px', color: '#FFFFFF', marginTop: '20px', marginBottom: '10px', marginLeft: '03px' }}>Enter Your Birthdate</h2>
                    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '13px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'row' }}>
                                <div className="dropdown-container" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="year" className="dropdown-label" style={{ color: '#FFFFFF', marginBottom: '5px' }}>Year:</label>
                                    <select id="year" value={year} onChange={(e) => setYear(e.target.value)} required style={{ width: '100px', height: '50px', backgroundColor: '#FFFFFF', color: '#134E0F', boxShadow: 'inset 0px 0px 5px 2px rgba(0, 0, 0, 0.2)', padding: '0.5em' }}>
                                        <option value="">Year</option>
                                        {renderYears()}
                                    </select>
                                </div>
                                <div className="dropdown-container" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="month" className="dropdown-label" style={{ color: '#FFFFFF', marginBottom: '5px' }}>Month:</label>
                                    <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} required style={{ width: '150px', height: '50px', backgroundColor: '#FFFFFF', color: '#134E0F', boxShadow: 'inset 0px 0px 5px 2px rgba(0, 0, 0, 0.2)', padding: '0.5em' }}>
                                        <option value="">Month</option>
                                        <option value="01">January</option>
                                        <option value="02">February</option>
                                        <option value="03">March</option>
                                        <option value="04">April</option>
                                        <option value="05">May</option>
                                        <option value="06">June</option>
                                        <option value="07">July</option>
                                        <option value="08">August</option>
                                        <option value="09">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                <div className="dropdown-container" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="day" className="dropdown-label" style={{ color: '#FFFFFF', marginBottom: '5px' }}>Day:</label>
                                    <select id="day" value={day} onChange={(e) => setDay(e.target.value)} required style={{ width: '100px', height: '50px', backgroundColor: '#FFFFFF', color: '#134E0F', boxShadow: 'inset 0px 0px 5px 2px rgba(0, 0, 0, 0.2)', padding: '0.5em' }}>
                                        <option value="">Day</option>
                                        {renderDays()}
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
