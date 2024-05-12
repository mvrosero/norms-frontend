import React from 'react';
import { useNavigate } from 'react-router-dom';

import AdminNavigation from "./AdminNavigation";
import AdminInfo from "./AdminInfo";

export default function AdminSettings() {
    return (
        <div>
            <AdminNavigation />
            <AdminInfo />
            <h6 className="page-title"> SETTINGS </h6>
        </div>
    );
}
