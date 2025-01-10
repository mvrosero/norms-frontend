import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewEmployeeModal = ({ show, onHide, user, roles }) => {
    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.role_id === roleId);
        return role ? role.role_name : '';
    };

    const renderStatus = (status) => {
        let backgroundColor, textColor;
        if (status === 'active') {
            backgroundColor = '#DBF0DC';
            textColor = '#30A530';
        } else if (status === 'inactive') {
            backgroundColor = '#F0DBDB';
            textColor = '#D9534F';
        } else {
            backgroundColor = '#EDEDED';
            textColor = '#6C757D'; 
        }

        return (
            <div style={{
                backgroundColor,
                color: textColor,
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: '30px',
                padding: '5px 20px',
                display: 'inline-flex',
                alignItems: 'center',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: textColor,
                    marginRight: '7px',
                }} />
                {status}
            </div>
        );
    };


return (
    <Modal show={show} onHide={onHide} size="lg" backdrop='static'>
        <Modal.Header>
            <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                ×
            </Button>
            <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW EMPLOYEE DETAILS</Modal.Title>
        </Modal.Header>
            <Modal.Body>
                {user ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '60px', marginRight: '10px' }}>
                        <p style={{ fontWeight: 'bold' }}>Employee ID Number:</p>
                        <p>{user.employee_idnumber}</p>

                        <p style={{ fontWeight: 'bold' }}>Full Name:</p>
                        <p>{`${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.suffix || ''}`}</p>

                        <p style={{ fontWeight: 'bold' }}>Email Address:</p>
                        <p>
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    textDecoration: 'underline', 
                                    color: '#4682B4', 
                                }}
                            >
                                {user.email}
                            </a>
                        </p>

                        <p style={{ fontWeight: 'bold' }}>Role:</p>
                        <p>{getRoleName(user.role_id)}</p>

                        <p style={{ fontWeight: 'bold' }}>Status:</p>
                        <p>{renderStatus(user.status)}</p>
                    </div>
                ) : (
                    <p>No user data available.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};


export default ViewEmployeeModal;
