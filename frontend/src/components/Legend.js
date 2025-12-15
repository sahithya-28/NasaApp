// src/components/Legend.js
import React from 'react';
import './Legend.css';

function Legend() {
  return (
    <div className="legend">
      <h4>Landings per Area</h4>
      <div><i style={{ background: '#92d400' }}></i>1 - 9</div>
      <div><i style={{ background: '#f5d423' }}></i>10 - 99</div>
      <div><i style={{ background: '#f0962d' }}></i>100+</div>
    </div>
  );
}

export default Legend;