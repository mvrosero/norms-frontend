import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  

const MyRecordsVisual = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('role_id');

    if (!token || roleId !== '3') {
      navigate('/unauthorized', { replace: true });
    }
  }, [navigate]);


  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch('http://localhost:9000/subcategories');
        if (!response.ok) {
          throw new Error('Failed to fetch subcategories');
        }
        const data = await response.json();
        setSubcategories(data); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, []); 
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {subcategories.map((subcategory, index) => (
        <Link key={index} to={`http://localhost:3000/student-myrecords/${subcategory.subcategory_name.replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
            <div style={{ width: '1050px', backgroundColor: 'white', border: '1px solid #818181', borderRadius: '5px', padding: '20px', marginLeft: '90px', cursor: 'pointer' }}>
                    <h3 style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '20px', margin: '0 0 10px 0' }}>
                        {subcategory.subcategory_name}
                    </h3>
                    <p style={{ fontFamily: 'Poppins, sans-serif', color: '#818181', fontSize: '16px', margin: '0' }}>
                        Content of container {index + 1} under {subcategory.department_name}
                    </p>
            </div>
        </Link>
      ))}
    </div>
  );
};


export default MyRecordsVisual;
