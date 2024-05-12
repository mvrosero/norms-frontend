import React from 'react';
import { useNavigate } from 'react-router-dom';


import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';


export default function StudentLegislations() {
    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title"> LEGISLATIONS </h6>
        </div>
    );
}
