import React from 'react';

import UserInfo from "../general/UserInfo";
import SearchAndFilter from '../corefunctions/SearchAndFilter';

export default function Violations() {
    return (
        <div>
            <UserInfo />
            <h6 className="page-title"> VIOLATIONS </h6>
            <div style={{ margin: '30px 30px 30px 30px', alignContent: 'center', paddingLeft: '70px' }}>
                <SearchAndFilter />
            </div>
        </div>
    );
}
