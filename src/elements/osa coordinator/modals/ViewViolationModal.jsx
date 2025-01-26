import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'react-quill/dist/quill.snow.css';
import '../../../styles/index.css';

const ViewViolationModal = ({ show, onHide, selectedRecord }) => {
    console.log(selectedRecord); 

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static" >
            <Modal.Header>
                <Button variant="link" onClick={onHide} style={{ position: 'absolute', top: '5px', right: '20px', textDecoration: 'none', fontSize: '30px', color: '#a9a9a9' }}>
                    ×
                </Button>
                <Modal.Title style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center', width: '100%' }}>VIEW VIOLATION RECORD</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedRecord && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '10px', marginLeft: '60px', marginRight: '20px' }}>
                        <p style={{ fontWeight: 'bold' }}>Date:</p>
                        <p>
                        {selectedRecord.created_at
                            ? `${new Date(selectedRecord.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}, ${new Date(selectedRecord.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}`
                            : 'N/A'}
                        </p>

                        <p style={{ fontWeight: 'bold' }}>Academic Year:</p>
                        <p>{`${selectedRecord.start_year} - ${selectedRecord.end_year}`}</p>

                        <p style={{ fontWeight: 'bold' }}>Semester:</p>
                        <p>{selectedRecord.semester_name}</p>

                        <p style={{ fontWeight: 'bold' }}>Category:</p>
                        <p>{selectedRecord.category_name}</p>

                        <p style={{ fontWeight: 'bold' }}>Offense:</p>
                        <p>{selectedRecord.offense_name}</p>

                        <p style={{ fontWeight: 'bold' }}>Sanctions:</p>
                        <p>{selectedRecord.sanction_names}</p>

                        <p style={{ fontWeight: 'bold' }}>Description:</p>
                        <p className="quill-content"
                            style={{ textAlign: 'justify' }}
                            dangerouslySetInnerHTML={{
                                __html: selectedRecord.description,
                            }} />
                    </div>
                    
                )}
            </Modal.Body>
        </Modal>
    );
};


export default ViewViolationModal;
