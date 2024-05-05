import React from 'react';

import StudentNavigation from './StudentNavigation';
import UserInfo from "../general/UserInfo";

export default function StudentOnlineClearance() {
    return (
        <div>
            <StudentNavigation />
            <UserInfo />
            <h6 className="page-title"> MY CLEARANCES </h6>
        </div>
    );
}