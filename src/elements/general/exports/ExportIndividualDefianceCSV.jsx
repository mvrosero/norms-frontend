import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';


const ExportIndividualDefianceCSV = ({ student_idnumber }) => {
    const [loading, setLoading] = useState(false); // To show loading state

    const handleExportClick = async () => {
        if (!student_idnumber) {
            Swal.fire('Error', 'Student ID number is required', 'error');
            return;
        }

        setLoading(true); // Start loading

        try {
            const response = await axios.get(`https://test-backend-api-2.onrender.com/uniform_defiances/export/${student_idnumber}`, {
                responseType: 'blob', // Handle the file download
            });

            // Check if the response is a valid CSV file (could be based on content-type)
            if (response.data.type === 'text/csv') {
                // Generate a timestamp for the file name
                const now = new Date();
                const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '/').split('.')[0];

                // Create a URL for the file
                const fileURL = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = `individual_uniform_defiances(${student_idnumber})-(${timestamp}).csv`; // Set the file name
                link.click(); // Trigger the download

                Swal.fire('Success', 'CSV file exported successfully!', 'success');
            } else {
                Swal.fire('Error', 'The export file is not a valid CSV format', 'error');
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
            Swal.fire('Error', 'Failed to export CSV. Please try again.', 'error');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div>
            <Button
                onClick={handleExportClick}
                disabled={loading} 
                style={{
                    backgroundColor: '#FAD32E',
                    color: 'white',
                    fontWeight: '900',
                    padding: '12px 15px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                    transition: 'box-shadow 0.3s ease',
                }}
            >
                {loading ? 'Exporting...' : 'Export CSV'}
                <FileDownloadRoundedIcon style={{ marginLeft: '10px', fontSize: '20px' }} />
            </Button>
        </div>
    );
};

export default ExportIndividualDefianceCSV;
