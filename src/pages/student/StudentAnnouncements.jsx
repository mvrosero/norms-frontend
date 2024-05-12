import React from 'react';
import { useNavigate } from 'react-router-dom';

import StudentInfo from './StudentInfo';
import StudentNavigation from './StudentNavigation';

export default function StudentAnnouncements() {   
    return (
        <div>
            <StudentNavigation />
            <StudentInfo />
            <h6 className="page-title" style={{ marginRight: '10px' }}> ANNOUNCEMENTS </h6>
        </div>
    );
}
