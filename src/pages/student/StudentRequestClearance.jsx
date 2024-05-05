import React from 'react';

import StudentNavigation from './StudentNavigation';
import UserInfo from "../general/UserInfo";

export default function StudentRequestClearance() {
    return (
        <div>
            <StudentNavigation />
            <UserInfo />
            <h6 className="page-title"> CLEARANCE REQUEST </h6>
        </div>
    );
}