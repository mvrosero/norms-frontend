import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ImportCSVButton = () => {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:9000/import-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', response.data.message, 'success');
        } catch (error) {
            console.error('Error importing CSV:', error);
            Swal.fire('Error', 'Failed to import CSV. Please try again.', 'error');
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="csv-upload"
            />
            <label htmlFor="csv-upload" style={{
                backgroundColor: '#FAD32E',
                color: 'white',
                fontWeight: '900',
                padding: '12px 15px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
                Import CSV
            </label>
        </div>
    );
};

export default ImportCSVButton;
