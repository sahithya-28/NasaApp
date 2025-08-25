export async function fetchDataset(dataset) {
  try {
    const res = await fetch(`http://localhost:5000/${dataset}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
