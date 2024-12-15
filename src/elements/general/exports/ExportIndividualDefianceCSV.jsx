import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
            const response = await axios.get(`http://localhost:9000/uniform_defiances/export/${student_idnumber}`, {
                responseType: 'blob', // Handle the file download
            });

            // Check if the response is a valid CSV file (could be based on content-type)
            if (response.data.type === 'text/csv') {
                // Create a URL for the file
                const fileURL = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = `individual_uniform_defiances_${student_idnumber}.csv`; // Set the file name
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
        <div style={{ padding: '20px' }}>
            <button
                onClick={handleExportClick}
                disabled={loading} // Disable button during loading
                style={{
                    backgroundColor: '#FAD32E',
                    color: 'white',
                    fontWeight: '900',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer', // Disable cursor during loading
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    height: '40px',
                    minWidth: '80px',
                    maxWidth: '150px',
                    justifyContent: 'center',
                }}
            >
                {loading ? 'Exporting...' : 'Export CSV'}
                <FileDownloadRoundedIcon
                    style={{
                        marginLeft: '10px', // Add some space between text and icon
                        fontSize: '20px', // Adjust icon size if necessary
                    }}
                />
            </button>
        </div>
    );
};

export default ExportIndividualDefianceCSV;
