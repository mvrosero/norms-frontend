import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

const ExportUserLogsCSV = () => {
    const [loading, setLoading] = useState(false); 

    const handleExportClick = async () => {
        setLoading(true); 

        try {
            const response = await axios.get('https://test-backend-api-2.onrender.com/histories/export', {
                responseType: 'blob', 
            });

            if (response.data.type === 'text/csv') {
                const now = new Date();
                const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '/').split('.')[0];

                const fileURL = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = `user_logs(${timestamp}).csv`; 
                link.click(); 

                Swal.fire('Success', 'CSV file exported successfully!', 'success');
            } else {
                Swal.fire('Error', 'The export file is not a valid CSV format', 'error');
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
            Swal.fire('Error', 'Failed to export CSV. Please try again.', 'error');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button
                onClick={handleExportClick}
                disabled={loading}
                style={{
                    backgroundColor: '#FAD32E',
                    color: 'white',
                    fontWeight: '900',
                    padding: '12px 25px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s ease, padding 0.3s ease', 
                    boxSizing: 'border-box', 
                }}
            >
                {loading ? 'Exporting...' : 'Export CSV'}
                <FileDownloadRoundedIcon style={{ marginLeft: '10px', fontSize: '20px' }} />
            </button>
        </div>
    );
};


export default ExportUserLogsCSV;
