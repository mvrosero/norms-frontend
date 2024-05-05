import React, { useState } from 'react';

export default function CreateViolationModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        idNumber: '',
        name: '',
        category: '',
        offense: '',
        sanction: '',
        academicYear: '',
        semester: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement logic to submit the form data
        console.log(formData);
        // Close the modal after submission
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <h2 className="title">Create Violation</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label" htmlFor="idNumber">ID Number:</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    id="idNumber"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        {/* Add unique ids for other input fields and dropdowns similarly */}
                        <div className="field">
                            <label className="label" htmlFor="description">Description:</label>
                            <div className="control">
                                <textarea
                                    className="textarea"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button type="submit" className="button is-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
}
