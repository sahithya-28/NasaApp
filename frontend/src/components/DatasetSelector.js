import React from "react";

function DatasetSelector({ setView }) {
  return (
    <div>
      <button onClick={() => setView("1D")}>1D (Table)</button>
      <button onClick={() => setView("2D")}>2D (Map)</button>
      <button onClick={() => setView("3D")}>3D (Globe)</button>
    </div>
  );
}

export default DatasetSelector;