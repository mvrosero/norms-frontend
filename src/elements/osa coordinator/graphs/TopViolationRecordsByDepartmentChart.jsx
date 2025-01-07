import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const TopViolationRecordsByDepartmentChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch violation records count from the backend
    fetch('http://localhost:9000/api/top-violationrecords')
      .then((response) => response.json())
      .then((data) => {
        // Sort departments alphabetically
        const sortedData = data.sort((a, b) => a.department_name.localeCompare(b.department_name));

        const departments = ['', ...sortedData.map((record) => record.department_name), '']; // Add 'Start' at the beginning and 'End' at the end
        const violationCounts = [0, ...sortedData.map((record) => record.violation_count), 0]; // Add 0 at the beginning for the starting point

        // Create color for the points based on value
        const getColorForValue = (value) => {
          if (value >= 1 && value <= 150) {
            return 'rgba(255, 255, 0, 0.6)';  // Yellow
          } else if (value >= 151 && value <= 249) {
            return 'rgba(255, 165, 0, 0.6)';  // Orange
          } else if (value >= 250) {
            return 'rgba(255, 0, 0, 0.6)';  // Red
          }
          return 'rgba(75, 192, 192, 0.6)';  // Default color (light blue)
        };

        const pointColors = violationCounts.map(getColorForValue);

        // Set chart data
        setChartData({
          labels: departments,
          datasets: [
            {
              label: 'Violation Records',
              data: violationCounts,
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.6)', // Default color for the line
              borderColor: 'rgba(75,192,192,1)',      // Default border color for the line
              borderWidth: 2,
              pointBackgroundColor: pointColors, // Apply color based on value range
              pointBorderColor: '#fff', // Color for data points border
              pointBorderWidth: 2,
              pointRadius: 5, // Size of the data point
              lineTension: 0.2,
            },
          ],
        });
      })
      .catch((err) => console.error('Error fetching violation records:', err));
  }, []);

  // Chart options to configure axis, tooltips, and text labels
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Departments',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Violation Count',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'top',
        font: {
          weight: 'bold',
          size: 12,
        },
        color: 'rgba(75,192,192,1)',
        formatter: (value) => value, // Show the value on top of each point
      },
    },
  };

  return (
    <div>
      <h2>Violation Records per Department</h2>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TopViolationRecordsByDepartmentChart;
