import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';

// Import images directly from the src folder
import cbm from '../../components/images/cbm.png';

export default function StudentLegislations() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('role_id');

        if (!token || roleId !== '3') {
            navigate('/unauthorized', { replace: true });
        }
    }, [navigate]);

    if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '3') {
        return null;
    }

    // Array of imported image objects (use the same image or different images if needed)
    const images = [cbm, cbm, cbm, cbm, cbm, cbm, cbm, cbm];

    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title">LEGISLATIONS</h6>
            <SearchAndFilter />

            <style>
                {`
                    .grid-container {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin: 20px auto;
                        max-width: 1200px;
                    }

                    .grid-item {
                        background-color: #f1f1f1;
                        border-radius: 8px;
                        text-align: center;
                        padding: 0;
                        cursor: pointer;
                        transition: transform 0.2s;
                        overflow: hidden;
                    }

                    .grid-item:hover {
                        transform: scale(1.05);
                    }

                    .grid-item img {
                        width: 100%;
                        height: 150px;
                        object-fit: cover;
                        border-bottom: 2px solid #ddd;
                    }

                    .grid-item p {
                        margin: 10px 0;
                        font-size: 14px;
                        padding: 0 10px;
                    }
                `}
            </style>

            <div className="grid-container">
                {images.map((image, index) => (
                    <Link to={`/legislations/${index + 1}`} className="grid-item" key={index}>
                        <img src={image} alt={`Legislation ${index + 1}`} />
                        <p>Text for Item {index + 1}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
