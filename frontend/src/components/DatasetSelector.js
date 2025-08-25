import React from "react";

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
    </div>
  );
}

export default DatasetSelector;
