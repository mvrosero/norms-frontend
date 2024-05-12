import React from 'react';
import { FaFileCsv } from 'react-icons/fa';
import ImportCSV from '../Input/ImportCSV';

function ImportCSVButton({ onClick }) {
  return (
    <button
      onClick={ImportCSV}
      style={{
        backgroundColor: '#FAD32E',
        color: 'white',
        fontWeight: '900',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      Import CSV
      <FaFileCsv style={{ marginLeft: '10px' }} />
    </button>
  );
}

export default ImportCSVButton;
