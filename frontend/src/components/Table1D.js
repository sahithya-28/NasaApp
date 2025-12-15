// src/components/Table1D.js
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import './Table1D.css';

const Row = ({ index, style, data }) => {
  const item = data[index];
  
  // Handle different date formats
  const displayDate = item.date ? new Date(item.date).toLocaleDateString() : (item.year ? new Date(item.year).getFullYear() : 'N/A');

  return (
    <div className="table-row" style={style}>
      <div className="table-cell">{item.name || 'N/A'}</div>
      <div className="table-cell">{item.category || 'Meteorite'}</div>
      <div className="table-cell">{displayDate}</div>
      <div className="table-cell">{item.reclat}</div>
      <div className="table-cell">{item.reclong}</div>
    </div>
  );
};

function Table1D({ data }) {
  if (!data || data.length === 0) {
    return <p>Loading data or no data available...</p>;
  }

  return (
    <div className="table-container-virtual">
      <div className="table-header">
        <div className="table-cell">Name</div>
        <div className="table-cell">Category</div>
        <div className="table-cell">Date</div>
        <div className="table-cell">Latitude</div>
        <div className="table-cell">Longitude</div>
      </div>
      <List
        height={600}
        itemCount={data.length}
        itemSize={45}
        width="10"
        itemData={data}
      >
        {Row}
      </List>
    </div>
  );
}

export default Table1D;