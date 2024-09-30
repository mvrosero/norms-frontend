import React from 'react';
import { Modal } from 'react-bootstrap';

const ViewStudentModal = ({ user, handleClose, departments, programs }) => {
    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.department_id === departmentId);
        return department ? department.department_name : '';
    };

    const getProgramName = (programId) => {
        const program = programs.find(p => p.program_id === programId);
        return program ? program.program_name : '';
    };

    return (
        <div>
            <p><strong>ID Number:</strong> {user.student_idnumber}</p>
            <p><strong>Full Name:</strong> {`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</p>
            <p><strong>Email Address:</strong> {user.email}</p>
            <p><strong>Year Level:</strong> {user.year_level}</p>
            <p><strong>Department:</strong> {getDepartmentName(user.department_id)}</p>
            <p><strong>Program:</strong> {getProgramName(user.program_id)}</p>
            <p><strong>Status:</strong> {user.status}</p>
        </div>
    );
};

export default ViewStudentModal;
