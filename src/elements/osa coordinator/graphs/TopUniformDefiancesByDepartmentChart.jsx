import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const departmentColors = {
  'College of Computer Studies': '#4B9393',   // Teal
  'College of Criminal Justice Education': '#CE1F20',   // Red
  'College of Engineering': '#772133',        // Maroon
  'College of Arts and Sciences': '#5FB4FA',  // Light Blue
  'College of Teacher Education': '#54A210',  // Blue
  'College of Accountancy and Finance': '#F0CD44', // Yellow
  'College of Business Management': '#E28641',  // Orange
  'College of Health Sciences': '#10A955',    // Green
};

const TopUniformDefiancesByDepartmentChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch uniform defiance records count from the backend
    fetch('http://localhost:9000/api/top-uniformdefiances')
      .then((response) => response.json())
      .then((data) => {
        // Sort departments alphabetically if necessary
        const sortedData = data.sort((a, b) => a.department_name.localeCompare(b.department_name));

        const departments = sortedData.map((record) => record.department_name); // Get department names
        const uniformDefianceCounts = sortedData.map((record) => record.uniform_defiance_count); // Get counts for uniform defiance
        
        // Set custom colors for the bars based on department names
        const barColors = departments.map((department) => departmentColors[department] || '#000000'); // Default to black if not found

        // Set chart data
        setChartData({
          labels: departments,
          datasets: [
            {
              label: 'Uniform Defiance Records',
              data: uniformDefianceCounts,
              backgroundColor: barColors, // Apply dynamic colors
              borderColor: barColors, // Apply dynamic border colors
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error('Error fetching uniform defiance records:', err));
  }, []);

  // Chart options
  const options = {
    responsive: true,
    indexAxis: 'y', // Makes the chart vertical (horizontal bars)
    scales: {
      x: {
        title: {
          display: true,
          text: 'Uniform Defiance Count',
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Department',
        },
        ticks: {
          autoSkip: false, // Prevents skipping ticks if too many
        },
      },
    },
  };

  return (
    <div>
      <h2>Top Uniform Defiance Records by Department</h2>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TopUniformDefiancesByDepartmentChart;
