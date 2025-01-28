import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';

import constitution from '../../components/images/constitution.png';
import hazing from '../../components/images/hazing.jpg';
import safespace from '../../components/images/safespace.jpg';
import cybercrime from '../../components/images/cybercrime.jpg';
import harassment from '../../components/images/harassment.jpg';
import dataprivacy from '../../components/images/dataprivacy.jpg';
import journalism from '../../components/images/journalism.jpg';
import drugs from '../../components/images/drugs.jpg';

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

    const images = [constitution, hazing, safespace, cybercrime, harassment, dataprivacy, journalism, drugs];


return (
    <div>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginBottom: '20px', marginLeft: '50px' }}>Legislations</h6>
            </div>

            <style>
                {`
                    .grid-container {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin: 20px auto;
                        max-width: 1100px;
                    }

                    .grid-item {
                        background-color: #f1f1f1;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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


            <div className="grid-container" style={{ marginLeft: '120px', fontWeight: '500' }}>
                {images.map((image, index) => {
                    const titles = [
                        "1987 Constitution",
                        "Anti-Hazing Law",
                        "Safe Spaces Act",
                        "Cybercrime Law",
                        "Anti-Sexual Harassment Law",
                        "Data Privacy Act",
                        "Campus Journalism Law",
                        "Dangerous Drug Act"
                    ]; 
                    return (
                        <Link to={`/legislations/${index + 1}`} className="grid-item" key={index}>
                            <img src={image} alt={titles[index]} />
                            <p>{titles[index]}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
