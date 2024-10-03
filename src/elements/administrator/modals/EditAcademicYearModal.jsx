// EditAcademicYearModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditAcademicYearModal = ({ show, handleClose, handleSubmit, formData, handleChange, editMode }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Academic Year Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="acadyear_code"
                            value={formData.acadyear_code}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Year</label>
                        <input
                            type="number"
                            className="form-control"
                            name="start_year"
                            value={formData.start_year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Year</label>
                        <input
                            type="number"
                            className="form-control"
                            name="end_year"
                            value={formData.end_year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            className="form-control"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <Button type="submit" className="btn btn-primary">
                        {editMode ? 'Update' : 'Add'} Academic Year
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditAcademicYearModal;
