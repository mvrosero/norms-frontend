import { IoDocuments, IoFileTrayFull } from 'react-icons/io5';
import { RiFileHistoryFill } from 'react-icons/ri';
import logo from '../../assets/images/norms_logo.png'; // Path to the logo image


import UserInfo from "../general/UserInfo";
import CoordinatorNavigation from './CoordinatorNavigation';

export default function CoordinatorDashboard() {
    return (
        <div>
            <CoordinatorNavigation />
            <UserInfo />
            <h6 className="page-title"> DASHBOARD </h6>
        </div>
    );
}
