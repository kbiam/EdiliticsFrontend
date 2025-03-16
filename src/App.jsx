// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Chart from './components/Chart';
import ControlPanel from './components/ControlPanel';
import { generateMockData, addDataPoint } from './utils/dataUtils';

function App() {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState('light');
  const [chartType, setChartType] = useState('bar');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Load initial data
  useEffect(() => {
    const initialData = generateMockData(10);
    setData(initialData);
    
    // Extract all categories for filter options
    const categories = [...new Set(initialData.map(item => item.category))];
    setAllCategories(categories);
  }, []);

  // Handle adding new data
  const handleAddData = () => {
    const newData = addDataPoint(data);
    setData(newData);
  };

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Handle filter change
  const handleFilterChange = (category) => {
    if (filteredCategories.includes(category)) {
      setFilteredCategories(filteredCategories.filter(c => c !== category));
    } else {
      setFilteredCategories([...filteredCategories, category]);
    }
  };

  // Filter data based on selected categories
  const filteredData = filteredCategories.length > 0
    ? data.filter(d => filteredCategories.includes(d.category))
    : data;

  return (
    <div className={`App ${theme}`}>
      <header>
        <h1>Interactive Data Visualization</h1>
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </header>
      
      <main>
        <ControlPanel
          onAddData={handleAddData}
          chartType={chartType}
          onChartTypeChange={handleChartTypeChange}
          categories={allCategories}
          filteredCategories={filteredCategories}
          onFilterChange={handleFilterChange}
        />
        
        <div className="chart-container">
          <Chart 
            data={filteredData} 
            chartType={chartType} 
            theme={theme} 
          />
        </div>
      </main>
      
    </div>
  );
}

export default App;