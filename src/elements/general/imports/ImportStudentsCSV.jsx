import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DescriptionIcon from '@mui/icons-material/Description';

const ImportStudentsCSV = () => {
    const [file, setFile] = useState(null);
    
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:9000/importcsv-student', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', response.data.message, 'success');
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    Swal.fire('Error', error.response.data.error, 'error');
                } else {
                    Swal.fire('Error', 'An unknown error occurred while processing the file.', 'error');
                }
            } else {
                Swal.fire('Error', 'Failed to import CSV. Please try again.', 'error');
            }
        }
    };

    
    return (
        <div style={{ padding: '15px' }}>
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
                    padding: '12px 20px', 
                    borderRadius: '10px',
                    marginLeft: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                Import CSV
                <DescriptionIcon style={{ marginLeft: '10px' }} fontSize="small" />
            </label>
        </div>
    );
};


export default ImportStudentsCSV;
