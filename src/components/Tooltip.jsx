import React from 'react';
import './Tooltip.css';

const Tooltip = ({ data }) => {
  if (!data) return null;

  const { x, y, name, value, category, date, percentage } = data;
  
  const style = {
    left: `${x + 10}px`,
    top: `${y - 10}px`,
  };

  return (
    <div className="tooltip" style={style}>
      <div className="tooltip-title">{name}</div>
      <div className="tooltip-value">
        Value: <strong>{value}</strong>
      </div>
      {category && (
        <div className="tooltip-category">
          Category: <strong>{category}</strong>
        </div>
      )}
      {date && (
        <div className="tooltip-date">
          Date: <strong>{new Date(date).toLocaleDateString()}</strong>
        </div>
      )}
      {percentage && (
        <div className="tooltip-percentage">
          Percentage: <strong>{percentage}%</strong>
        </div>
      )}
    </div>
  );
};

export default Tooltip;