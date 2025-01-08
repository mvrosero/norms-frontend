import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const TopViolationNaturesChart = ({ startDate, endDate }) => {
  const [state, setState] = useState({
    series: [
      {
        data: [], 
      },
    ],
    options: {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap', 
      },
      colors: [
        '#087830'
      ], 
    },
  });

  useEffect(() => {
    const fetchData = () => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      // Fetch top violation natures from the backend
      fetch(`http://localhost:9000/api/top-violationnatures?${params.toString()}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((record) => ({
            x: record.nature_name, 
            y: record.violation_count, 
          }));

          setState({
            series: [{ data: formattedData }],
            options: { ...state.options },
          });
        })
        .catch((err) => console.error('Error fetching top violation natures:', err));
    };
    fetchData();
  }, [startDate, endDate]);

  
  return (
    <div>
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

export default TopViolationNaturesChart;
