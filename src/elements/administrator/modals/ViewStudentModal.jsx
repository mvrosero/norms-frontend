import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewStudentModal = ({ show, onHide, user }) => {

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
            <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW STUDENT DETAILS</Modal.Title>
        </Modal.Header>
            <Modal.Body>
                {user ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '60px', marginRight: '20px' }}>
                        <p style={{ fontWeight: 'bold' }}>Student ID Number:</p>
                        <p>{user.student_idnumber}</p>

                        <p style={{ fontWeight: 'bold' }}>Full Name:</p>
                        <p>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix}`}</p>

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

                        <p style={{ fontWeight: 'bold' }}>Year Level:</p>
                        <p>{user.year_level}</p>

                        <p style={{ fontWeight: 'bold' }}>Batch:</p>
                        <p>{user.batch}</p>

                        <p style={{ fontWeight: 'bold' }}>Department:</p>
                        <p>{user.department_name}</p>

                        <p style={{ fontWeight: 'bold' }}>Program:</p>
                        <p>{user.program_name}</p>

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


export default ViewStudentModal;
