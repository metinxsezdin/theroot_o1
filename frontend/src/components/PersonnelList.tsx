import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonnelList = ({ onPersonClick, onFocusPerson, focusedPerson }) => {
  const [personnel, setPersonnel] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());

  // Fetch personnel and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personnelResponse, departmentsResponse] = await Promise.all([
          axios.get('http://localhost:5000/personnel'), // Backend API endpoint
          axios.get('http://localhost:5000/departments'), // Backend API endpoint
        ]);
        setPersonnel(personnelResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleDepartment = (departmentId) => {
    setExpandedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredPersonnel = personnel.filter((person) =>
    [person.name, person.role]
      .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const personnelByDepartment = departments
    .map((department) => {
      const departmentPersonnel = filteredPersonnel.filter(
        (person) => person.departmentId === department.id
      );
      return {
        ...department,
        personnel: departmentPersonnel,
      };
    })
    .filter((dept) => dept.personnel.length > 0);

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex-shrink-0 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Personnel</h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personnel..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {personnelByDepartment.map(({ id, name, color, personnel: departmentPersonnel }) => (
          <div key={id} className="bg-gray-50">
            <button
              onClick={() => toggleDepartment(id)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                {expandedDepartments.has(id) ? '▼' : '▶'}
                <span className="font-medium text-sm" style={{ color }}>
                  {name}
                </span>
                <span className="text-xs text-gray-500">
                  ({departmentPersonnel.length})
                </span>
              </div>
            </button>
            {expandedDepartments.has(id) && (
              <div>
                {departmentPersonnel.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => onPersonClick(person)}
                    className="pl-8 pr-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    {person.name} - {person.role}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonnelList;
