import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const TopOffensesByDepartmentChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'offense-bar-chart',
        stacked: true,
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Offenses',
          style: {
            fontWeight: '600',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Offense Count',
          style: {
            fontWeight: '600',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
    },
    series: [],
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch the data
  const fetchData = () => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    axios
      .get('http://localhost:9000/api/top-offenses', { params })
      .then((response) => {
        const departments = [];
        const offenses = [];
        const offenseCountsByDepartment = {};
        const departmentColors = {
          'College of Computer Studies': '#4B9393',
          'College of Criminal Justice Education': '#CE1F20',
          'College of Engineering': '#772133',
          'College of Arts and Sciences': '#5FB4FA',
          'College of Teacher Education': '#54A210',
          'College of Accountancy and Finance': '#F0CD44',
          'College of Business Management': '#E28641',
          'College of Health Sciences': '#10A955',
        };

        // Organize data by offense and department
        response.data.forEach((row) => {
          if (!offenses.includes(row.offense_name)) {
            offenses.push(row.offense_name);
          }
          if (!departments.includes(row.department_name)) {
            departments.push(row.department_name);
          }

          // Initialize offense counts for departments if not already
          if (!offenseCountsByDepartment[row.offense_name]) {
            offenseCountsByDepartment[row.offense_name] = {};
          }
          offenseCountsByDepartment[row.offense_name][row.department_name] =
            row.offense_count;
        });

        // Prepare the chart data
        const seriesData = departments.map((department) => {
          return {
            name: department,
            data: offenses.map(
              (offense) => offenseCountsByDepartment[offense][department] || 0
            ),
            color: departmentColors[department] || '#000000',
          };
        });

        // Set the chart data and options
        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              categories: offenses,
            },
          },
          series: seriesData,
        });
      })
      .catch((error) => {
        console.error('Error fetching offenses data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const handleFilter = () => {
    fetchData(); // Fetch data based on the selected date range
  };

  return (
    <div>
      {/* Date range filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <div>
          <label htmlFor="startDate">Start Date: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '5px' }}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date: </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '5px' }}
          />
        </div>
        <button
          onClick={handleFilter}
          style={{
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Apply Filter
        </button>
      </div>

      {/* Chart */}
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default TopOffensesByDepartmentChart;

