import React, { useState } from 'react';

function ImportCSV({ onUpload }) {
  const [file, setFile] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Perform file upload action, you can pass 'file' to a function to handle the upload
      onUpload(file);
      // Reset file input
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <button type="submit">Upload CSV</button>
    </form>
  );
}

export default ImportCSV;
