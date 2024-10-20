import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ImportStudentsCSV = () => {
    const [file, setFile] = useState(null);
    
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:9000/register-student', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Use SweetAlert for success notification
            Swal.fire('Success', response.data.message, 'success');
        } catch (error) {
            console.error('Error importing CSV:', error);
            Swal.fire('Error', 'Failed to import CSV. Please try again.', 'error');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="csv-upload"
            />
            <label
                htmlFor="csv-upload"
                style={{
                    backgroundColor: '#FAD32E',
                    color: 'white',
                    fontWeight: '900',
                    padding: '10px 20px', // Increased padding for better sizing
                    border: 'none',
                    borderRadius: '10px',
                    marginLeft: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    height: '40px', // Set consistent height
                    minWidth: '80px', // Set minimum width
                    maxWidth: '150px', // Set maximum width
                    justifyContent: 'center', // Center the text inside
                }}
            >
                Import CSV
            </label>
        </div>
    );
};

export default ImportStudentsCSV;
