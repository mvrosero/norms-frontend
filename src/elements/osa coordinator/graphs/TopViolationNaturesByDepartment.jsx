import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const TopViolationNaturesByDepartment = () => {
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
  });

  useEffect(() => {
    // Fetch top violation natures from the backend
    fetch('http://localhost:9000/api/top-violationnatures')
      .then((response) => response.json())
      .then((data) => {
        // Extract violation names and counts
        const labels = data.map((record) => record.nature_name);
        const series = data.map((record) => record.violation_count);

        // Update chart data
        setChartData({ labels, series });
      })
      .catch((err) => console.error('Error fetching top violation natures:', err));
  }, []);

  const options = {
    chart: {
      width: 380,
      type: 'polarArea',
    },
    labels: chartData.labels,
    fill: {
      opacity: 1,
    },
    stroke: {
      width: 1,
      colors: undefined,
    },
    yaxis: {
      show: false,
    },
  };

  return (
    <div>
      <h2>Top Violation Natures</h2>
      {chartData.labels.length > 0 ? (
        <ApexCharts options={options} series={chartData.series} type="polarArea" height={350} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TopViolationNaturesByDepartment;
