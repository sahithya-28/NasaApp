import React from "react";

<<<<<<< HEAD
function DatasetSelector({ dataset, setDataset }) {
  return (
    <div className="p-4">
      <label className="mr-2 font-bold">Select Dataset:</label>
      <select
        value={dataset}
        onChange={(e) => setDataset(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="meteorites">Meteorite Landings</option>
        {/* Add more datasets later */}
      </select>
=======
function DatasetSelector({ setView }) {
  return (
    <div>
      <button onClick={() => setView("1D")}>1D (Table)</button>
      <button onClick={() => setView("2D")}>2D (Map)</button>
      <button onClick={() => setView("3D")}>3D (Globe)</button>
>>>>>>> efe0b2c (web design)
    </div>
  );
}

<<<<<<< HEAD
export default DatasetSelector;
=======
export default DatasetSelector;
>>>>>>> efe0b2c (web design)
