import React from 'react';

const ViewEmployeeModal = ({ user, roles }) => {
    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.role_id === roleId);
        return role ? role.role_name : '';
    };

    return (
        <div>
            <p><strong>ID Number:</strong> {user.employee_idnumber}</p>
            <p><strong>Full Name:</strong> {`${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {getRoleName(user.role_id)}</p>
            <p><strong>Status:</strong> {user.status}</p>
        </div>
    );
};

export default ViewEmployeeModal;
