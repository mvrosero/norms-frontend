import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const TopOffensesByDepartmentChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'offense-bar-chart',
        stacked: true,  // Enable stacking
      },
      xaxis: {
        categories: [], // Offenses will be on the x-axis
      },
      yaxis: {
        title: {
          text: 'Offense Count',
        },
      },
      legend: {
        position: 'top',  // Display legend at the top
        horizontalAlign: 'center', // Center the legend horizontally
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
    },
    series: [],
  });

  useEffect(() => {
    axios.get('http://localhost:9000/api/top-offenses')
      .then(response => {
        const departments = [];
        const offenses = [];
        const offenseCountsByDepartment = {}; // Store counts for each department per offense
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

        // Organize data by offense and department
        response.data.forEach(row => {
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
          offenseCountsByDepartment[row.offense_name][row.department_name] = row.offense_count;
        });

        // Prepare the chart data
        const seriesData = departments.map(department => {
          return {
            name: department,
            data: offenses.map(offense => offenseCountsByDepartment[offense][department] || 0),
            color: departmentColors[department] || '#000000',  // Assign color per department
          };
        });

        // Set the chart data and options
        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              categories: offenses,  // Set offenses on the x-axis
            },
          },
          series: seriesData,  // Stack data for each department
        });
      })
      .catch(error => {
        console.error('Error fetching offenses data:', error);
      });
  }, []); // Empty dependency array to fetch data once on mount

  return (
    <div>
      <h2>Top Offenses by Department</h2>
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
