import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ImportEmployeesCSV = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:9000/import-employees',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // SweetAlert for success notification
      Swal.fire('Success', response.data.message, 'success');
    } catch (error) {
      console.error('Error importing CSV:', error);
      Swal.fire('Error', 'Failed to import CSV. Please try again.', 'error');
    }
  };

  return (
    <input
      type="file"
      accept=".csv"
      onChange={handleFileChange}
      style={{ display: 'none' }}
      id="employee-csv-upload"
    />
  );
};

export default ImportEmployeesCSV;
