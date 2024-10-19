import React, { useRef, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import ImportStudentsCSV from '../imports/ImportStudentsCSV'; // Ensure this component handles file uploads
import ImportEmployeesCSV from '../imports/ImportEmployeesCSV'; // Ensure this component handles file uploads

function ImportCSVDropdownButton() {
  const [isOpen, setIsOpen] = useState(false);
  const studentFileInputRef = useRef(null); // Ref for the student file input
  const employeeFileInputRef = useRef(null); // Ref for the employee file input

  const handleOptionClick = (option) => {
    setIsOpen(false); // Close the dropdown
    if (option === 'Student') {
      studentFileInputRef.current.click(); // Trigger student file input
    } else if (option === 'Employee') {
      employeeFileInputRef.current.click(); // Trigger employee file input
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#3498db',
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
        <FaAngleDown
          style={{
            marginLeft: '10px',
            transition: 'transform 0.3s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            minWidth: '160px',
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ccc',
            borderRadius: '10px',
            marginTop: '5px',
          }}
        >
          <a
            href="#"
            style={{
              color: 'black',
              padding: '12px 16px',
              textDecoration: 'none',
              display: 'block',
              borderBottom: '1px solid #ccc',
            }}
            onClick={(e) => {
              e.preventDefault();
              handleOptionClick('Student'); // Handle student upload
            }}
          >
            Student
          </a>
          <a
            href="#"
            style={{
              color: 'black',
              padding: '12px 16px',
              textDecoration: 'none',
              display: 'block',
            }}
            onClick={(e) => {
              e.preventDefault();
              handleOptionClick('Employee'); // Handle employee upload
            }}
          >
            Employee
          </a>
        </div>
      )}
      <input
        type="file"
        ref={studentFileInputRef}
        style={{ display: 'none' }} // Hide the input
        accept=".csv" // Only accept CSV files
        onChange={(e) => {
          // Handle the file upload for students here
          const file = e.target.files[0];
          if (file) {
            console.log("Student CSV file selected:", file);
            // Add your file upload logic here
          }
        }}
      />
      <input
        type="file"
        ref={employeeFileInputRef}
        style={{ display: 'none' }} // Hide the input
        accept=".csv" // Only accept CSV files
        onChange={(e) => {
          // Handle the file upload for employees here
          const file = e.target.files[0];
          if (file) {
            console.log("Employee CSV file selected:", file);
            // Add your file upload logic here
          }
        }}
      />
    </div>
  );
}

export default ImportCSVDropdownButton;
