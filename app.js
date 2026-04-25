// Load initial data from data.json if not in localStorage
var localStorageKey = 'words';

async function loadData() {
  localStorage.removeItem(localStorageKey);
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error loading data.json:', error);
    localStorage.setItem(localStorageKey, JSON.stringify([]));
  }
}
// Initialize
loadData();

