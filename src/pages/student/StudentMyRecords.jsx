import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from './StudentNavigation';
import StudentInfo from './StudentInfo';


export default function StudentMyRecords() {
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch records data from the backend
        const fetchRecords = async () => {
            try {
                // Fetch data from the backend using axios
                const response = await axios.get('http://localhost:9000/violation_record/:id');
                // Set the retrieved data to the state
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        fetchRecords();
    }, []);

    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title">MY RECORDS</h6>
        </div>
    );
}
