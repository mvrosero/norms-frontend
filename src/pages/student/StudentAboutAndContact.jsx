import React from 'react';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from './StudentInfo';

export default function StudentAboutAndContact() {
    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title"> ABOUT AND CONTACT </h6>
        </div>
    );
}