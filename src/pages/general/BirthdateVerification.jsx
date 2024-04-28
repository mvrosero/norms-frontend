import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BirthdateVerificationPage.css'; // Import custom CSS for styling

const BirthdateVerificationPage = () => {
    const navigate = useNavigate();
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fetch user's data from the backend
            const response = await fetchUserData();

            if (!response.birthdate) {
                setError("User's birthdate not found");
                return;
            }

            // Format user's birthdate as month/day/year
            const formattedUserBirthdate = formatDate(response.birthdate);

            // Compare inputted birthdate with user's formatted birthdate
            if (birthdate === formattedUserBirthdate) {
                // Birthdate matches user's birthdate, navigate to dashboard
                navigate('/dashboard');
            } else {
                // Birthdate does not match user's birthdate, display an error message
                setError("Birthdate doesn't match the user's birthdate");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to fetch user data');
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
        <div className="container">
            <h2 className="title">Birthdate Verification</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="label">
                    Enter your birthdate:
                    <input type="date" className="input" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
                </label>
                <button type="submit" className="button">Verify</button>
            </form>
        </div>
    );
};

export default BirthdateVerificationPage;
