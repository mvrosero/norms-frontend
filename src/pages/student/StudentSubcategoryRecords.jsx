import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';

import StudentNavigation from '../student/StudentNavigation';
import StudentInfo from '../student/StudentInfo';
import SearchAndFilter from '../general/SearchAndFilter';
import SubcategoryTable from '../../elements/student/tables/SubcategoryTable';

const StudentSubcategoryRecords = () => {
  const navigate = useNavigate();
  const { subcategory_name } = useParams(); 
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState(subcategory_name || ''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('role_id');

    if (!token || roleId !== '3') {
      navigate('/unauthorized', { replace: true });
    }
  }, [navigate]);


  const fetchSubcategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get('http://localhost:9000/subcategories', { headers });
      setSubcategories(response.data);

      const subcategory = response.data.find(s => s.subcategory_name === subcategory_name());
      setSubcategoryName(subcategory ? subcategory.subcategory_name : 'Unknown Subcategory');
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  }, [subcategory_name]);
  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);
  if (!localStorage.getItem('token') || localStorage.getItem('role_id') !== '3') {
    return null;
  }


  return (
    <div>
      <StudentNavigation />
      <StudentInfo />

        {/* Title Section */}
        <div style={{ width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
            <h6 className="title" style={{ fontFamily: 'Poppins, sans-serif', color: '#242424', fontSize: '40px', fontWeight: 'bold', marginTop: '20px', marginLeft: '50px' }}> {subcategoryName.replace(/-/g, ' ') || subcategory_name.replace(/-/g, ' ')} </h6>
        </div>

        {/* Search And Filter Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginLeft: '70px', padding: '0 20px' }}>
            <div style={{ flex: '1', minWidth: '400px' }}> <SearchAndFilter /> </div>
        </div>

        {/* Breadcrumbs */}
        <nav style={{ marginTop: '5px', marginBottom: '20px', marginLeft: '120px' }}>
            <ol style={{ backgroundColor: 'transparent', padding: '0', margin: '0', listStyle: 'none', display: 'flex' }}>
            <li style={{ marginRight: '5px' }}>
                <Link to="/student-myrecords" style={{ textDecoration: 'none', color: '#0D4809' }}>
                My Records
                </Link>
            </li>
            <li style={{ margin: '0 5px', color: '#6c757d' }}>{'>'}</li>
            <li style={{ marginLeft: '5px', color: '#000' }}>
                {subcategoryName.replace(/-/g, ' ') || subcategory_name.replace(/-/g, ' ')}
            </li>
            </ol>
        </nav>

        <SubcategoryTable />
    </div>
  );
};


export default StudentSubcategoryRecords;
