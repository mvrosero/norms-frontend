import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';


const departmentColors = {
  'CCS': '#4B9393',   
  'CCJE': '#CE1F20',   
  'COE': '#772133',    
  'CAS': '#5FB4FA',   
  'CTE': '#54A210',   
  'CAF': '#F0CD44',    
  'CBM': '#E28641',   
  'CHS': '#10A955',    
};

const TopUniformDefiancesByDepartmentChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      // Fetch uniform defiance records count from the backend
      fetch(`https://test-backend-api-2.onrender.com/api/top-uniformdefiances?${params.toString()}`)
        .then((response) => response.json())
        .then((data) => {
          // Sort departments by department_code if necessary
          const sortedData = data.sort((a, b) => a.department_code.localeCompare(b.department_code));

          const departmentCodes = sortedData.map((record) => record.department_code);
          const uniformDefianceCounts = sortedData.map((record) => record.uniform_defiance_count); 

          // Map department codes to their respective colors
          const barColors = departmentCodes.map(
            (departmentCode) => departmentColors[departmentCode] || '#000000' 
          );
          setChartData({
            categories: departmentCodes,
            series: [
              {
                name: 'Uniform Defiance Records',
                data: uniformDefianceCounts,
              },
            ],
            colors: barColors, 
          });
        })
        .catch((err) => console.error('Error fetching uniform defiance records:', err));
    };
    fetchData();
  }, [startDate, endDate]);


  // Chart options for ApexCharts
  const options = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        tools: {
          download: true, 
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true, 
        distributed: true, 
      },
    },
    xaxis: {
      categories: chartData?.categories || [], 
      title: {
        text: 'Uniform Defiance Count',
        style: {
          fontWeight: '600',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Departments',
        style: {
          fontWeight: '600',
        },
      },
    },
    dataLabels: {
      enabled: false, 
    },
    legend: {
      show: false, 
    },
    colors: chartData?.colors || [], 
  };


  return (
    <div>
      {chartData ? (
        <ReactApexChart 
          options={options} 
          series={chartData.series} 
          type="bar" 
          height={400} 
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};


export default TopUniformDefiancesByDepartmentChart;
