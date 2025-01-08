import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const TopViolationNaturesByDepartmentChart = () => {
  const [state, setState] = useState({
    series: [
      {
        data: [], // This will hold the violation nature data (e.g., x: nature_name, y: violation_count)
      },
    ],
    options: {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap', // Change chart type to 'treemap'
      },
      title: {
        text: 'Top Violation Natures by Department', // Set title
      },
    },
  });

  useEffect(() => {
    // Fetch top violation natures from the backend
    fetch('http://localhost:9000/api/top-violationnatures')
      .then((response) => response.json())
      .then((data) => {
        // Format the data for the treemap chart
        const formattedData = data.map((record) => ({
          x: record.nature_name, // Set 'x' as violation nature name
          y: record.violation_count, // Set 'y' as the violation count
        }));

        // Update the chart state with the formatted data
        setState({
          series: [{ data: formattedData }],
          options: { ...state.options }, // Retain existing options
        });
      })
      .catch((err) => console.error('Error fetching top violation natures:', err));
  }, []);

  return (
    <div>
      <h2>Top Violation Natures</h2>
      {state.series[0].data.length > 0 ? (
        <ApexCharts
          options={state.options}
          series={state.series}
          type="treemap"
          height={350}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TopViolationNaturesByDepartmentChart;
