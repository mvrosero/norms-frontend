import React from 'react';
import { useNavigate } from 'react-router-dom';

import StudentNavigation from './StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentSettings() {
    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title"> SETTINGS </h6>
        </div>
    );
}
