import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from '../../../pages/student/StudentNavigation';
import StudentInfo from '../../../pages/student/StudentInfo';
import SearchAndFilter from '../../../pages/general/SearchAndFilter';

const StudentFAQsServices = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

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

    const toggleCollapsible = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


return (
    <div>
        <StudentNavigation />
        <StudentInfo />

            {/* Title Section */}
            <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
                <h6 className="section-title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}>Services</h6>
            </div>

            {/* Search And Filter Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginLeft: '70px', padding: '0 20px' }}>
                <SearchAndFilter />
            </div>

            {/* Breadcrumbs */}
            <nav style={{ marginTop: '5px', marginBottom: '30px', marginLeft: '120px' }}>
                <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex' }}>
                    <li className="breadcrumb-item" onClick={() => navigate('/student-faqs')} style={{ marginRight: '5px', color: '#0D4809' }}>
                        FAQs
                    </li>
                    <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
                    <li style={{ marginLeft: '5px', color: '#000' }}>
                        Services
                    </li>
                </ol>
            </nav>


            <style>
                {`
                    .collapsible {
                        background-color: #0D4809; 
                        color: white;
                        cursor: pointer;
                        padding: 18px;
                        width: 100%; 
                        max-width: 1100px; 
                        margin: 0 auto; 
                        border: none; 
                        text-align: left;
                        outline: none;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        transition: background-color 0.3s ease; 
                        height: 60px; 
                        border-radius: 8px 8px 0 0; 
                    }

                    .active, .collapsible:hover {
                        background-color: #005500; 
                    }

                    .content {
                        max-height: 0; 
                        max-width: 1100px; 
                        margin: 0 auto;
                        padding: 0 18px;
                        overflow: hidden;
                        background-color: #FFFFFF;
                        border: none; 
                        transition: max-height 0.3s ease, padding 0.3s ease;
                        width: 100%; 
                        box-sizing: border-box; 
                        margin-bottom: 0.5rem; 
                    }

                    .content.show {
                        max-height: 200px; 
                        padding: 18px;
                        margin-bottom: 1rem; 
                        border: 1px solid #0D4809; 
                        border-radius: 0 0 8px 8px;
                    }
                `}
            </style>


            {/* Collapsibles */}
            {['Question 1:', 
                'Question 2:', 
                'Question 3:', 
                'Question 4:',
                'Question 5:'].map((question, index) => (
                <div key={index} style={{ marginLeft: '80px' }}>
                    <button
                        type="button"
                        className={`collapsible ${openIndex === index ? 'active' : ''}`}
                        onClick={() => toggleCollapsible(index)}
                        style={{
                            borderRadius: openIndex === index ? '8px 8px 0 0' : '8px',  
                        }}
                    >
                        {question}
                        <span className="icon" style={{ fontSize: '24px', lineHeight: '60px' }}>
                            {openIndex === index ? '-' : '+'}
                        </span>
                    </button>
                    <div className={`content ${openIndex === index ? 'show' : ''}`} style={{ marginLeft: '38px' }}>
                        <p>
                            {index === 0 && "Answer 1."}
                            {index === 1 && "Answer 2."}
                            {index === 2 && "Answer 3."}
                            {index === 3 && "Answer 4."}
                            {index === 4 && "Answer 5."}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default StudentFAQsServices;
