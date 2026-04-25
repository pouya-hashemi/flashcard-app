
let allWords = [];
  let displayedCount = 0;
  const resultsDiv = document.getElementById('results');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  document.getElementById('searchBtn').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.toLowerCase();
    allWords = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const filtered = allWords.filter(word =>
      word.german.toLowerCase().includes(query) ||
      word.english.toLowerCase().includes(query)
    );
    displayedCount = 0;
    displayWords(filtered, true);
  });

  function displayWords(words, reset = false) {
    if (reset) {
      resultsDiv.innerHTML = '';
      displayedCount = 0;
    }
    const toShow = words.slice(displayedCount, displayedCount + 20);
    toShow.forEach(word => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML = `
        <div class="card bg-secondary text-light h-100">
          <div class="card-body">
            <h5 class="card-title">${word.article ? word.article + ' ' : ''}${word.german}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${word.english}</h6>
            <p class="card-text">
              ${word.plural ? 'Plural: ' + word.plural + '<br>' : ''}
              ${word.feminine ? 'Feminine: ' + word.feminine + '<br>' : ''}
              ${word.pastPerfect ? 'Past Perfect: ' + word.pastPerfect + '<br>' : ''}
              ${word.book ? 'Book: ' + word.book + '<br>' : ''}
              ${word.difficultyLevel ? 'Difficulty: ' + word.difficultyLevel + '<br>' : ''}
              ${word.conjugation.some(c => c.form) ? 'Conjugation: ' + word.conjugation.map(c => c.form).filter(f => f).join(', ') + '<br>' : ''}
              ${word.examples.length ? 'Examples: ' + word.examples.map(e => e.german + ' - ' + e.english).join('; ') : ''}
            </p>
          </div>
          // <div class="card-footer">
          //   <button class="btn btn-warning btn-sm me-2 edit-btn" data-id="${word.id}">Edit</button>
          //   <button class="btn btn-danger btn-sm delete-btn" data-id="${word.id}">Delete</button>
          // </div>
        </div>
      `;
      resultsDiv.appendChild(card);
    });
    displayedCount += toShow.length;
    if (displayedCount < words.length) {
      loadMoreContainer.style.display = 'block';
    } else {
      loadMoreContainer.style.display = 'none';
    }
  }

  loadMoreBtn.addEventListener('click', function () {
    displayWords(allWords);
  });

  
// Initialize
loadData();