import React from 'react';

import OSAStaffNavigation from './OSAStaffNavigation';
import UserInfo from "../general/UserInfo";
import SearchAndFilter from '../corefunctions/SearchAndFilter';

export default function OSAStaffUniformDefiance() {
    return (
        <div>
            <UserInfo />
            <OSAStaffNavigation />
            <h6 className="page-title"> UNIFORM DEFIANCE </h6>
            <div style={{ margin: '30px 30px 30px 30px', alignContent: 'center', paddingLeft: '70px' }}>
                <SearchAndFilter />
            </div>
        </div>
    );
}
