import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

import StudentNavigation from "../student/StudentNavigation";
import StudentInfo from "../student/StudentInfo";
import MyRecordsTable from './ViolationRecordsTable';

const StudentMyRecords = () => {
    return (
        <div>
            <h6 className="page-title">MY RECORDS</h6>
            <StudentNavigation />
            <StudentInfo />
            <MyRecordsTable />
        </div>
    );
};

export default StudentMyRecords;
