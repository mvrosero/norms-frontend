import React from 'react';

import StudentNavigation from '../student/StudentNavigation';
import UserInfo from "../general/UserInfo";

export default function AboutAndContact() {
    return (
        <div>
            <StudentNavigation />
            <UserInfo />
            <h6 className="page-title"> ABOUT AND CONTACT </h6>
        </div>
    );
}