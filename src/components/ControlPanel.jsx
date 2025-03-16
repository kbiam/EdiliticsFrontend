import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ 
  onAddData, 
  chartType, 
  onChartTypeChange, 
  categories, 
  filteredCategories, 
  onFilterChange 
}) => {
  return (
    <div className="control-panel">
      <div className="control-section">
        <h3>Chart Type</h3>
        <div className="chart-type-buttons">
          <button 
            className={chartType === 'bar' ? 'active' : ''} 
            onClick={() => onChartTypeChange('bar')}
          >
            Bar Chart
          </button>
          <button 
            className={chartType === 'line' ? 'active' : ''} 
            onClick={() => onChartTypeChange('line')}
          >
            Line Chart
          </button>
          <button 
            className={chartType === 'pie' ? 'active' : ''} 
            onClick={() => onChartTypeChange('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Data Controls</h3>
        <button onClick={onAddData} className="add-data-btn">
          Add Random Data
        </button>
      </div>

      <div className="control-section">
        <h3>Filter by Category</h3>
        <div className="category-filters">
          {categories.map(category => (
            <label key={category} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filteredCategories.includes(category)}
                onChange={() => onFilterChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Interactions</h3>
        <ul className="interaction-tips">
          <li>Hover over data points to see details</li>
          <li>Use mouse wheel to zoom (bar/line charts)</li>
          <li>Click and drag to pan (bar/line charts)</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;