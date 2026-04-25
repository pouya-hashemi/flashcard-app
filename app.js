// Load initial data from data.json if not in localStorage
var localStorageKey = 'words';

function loadData() {
  localStorage.removeItem(localStorageKey);
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data.json', false);
    xhr.send();
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    } else {
      throw new Error('Failed to load data.json');
    }
  } catch (error) {
    console.error('Error loading data.json:', error);
    localStorage.setItem(localStorageKey, JSON.stringify([]));
  }
}
// Initialize
loadData();

