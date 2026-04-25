let allWords = [];
let filteredWords = [];
let shuffledWords = [];
let currentIndex = 0;
let currentLanguage = 'english'; // or 'german'


function populateBookOptions() {
  const books = [...new Set(allWords.map(word => word.book).filter(book => book))];
  const bookFilter = document.getElementById('bookFilter');
  bookFilter.innerHTML = '';
  books.forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    bookFilter.appendChild(option);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function filterWords() {
  const selectedBooks = Array.from(document.getElementById('bookFilter').selectedOptions).map(option => option.value);
  const selectedDifficulties = Array.from(document.getElementById('difficultyFilter').selectedOptions).map(option => option.value);

  filteredWords = allWords.filter(word => {
    const bookMatch = selectedBooks.length === 0 || selectedBooks.includes(word.book);
    const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(word.difficultyLevel);
    return bookMatch && difficultyMatch;
  });

  shuffledWords = shuffleArray([...filteredWords]);
  currentIndex = 0;
  displayWord();
}

function displayWord() {
  if (shuffledWords.length === 0) {
    document.getElementById('wordCard').style.display = 'none';
    return;
  }

  const word = shuffledWords[currentIndex];
  const wordDisplay = document.getElementById('wordDisplay');
  wordDisplay.textContent = word[currentLanguage];

  // Reset displays
  document.getElementById('conjugationDisplay').style.display = 'none';
  document.getElementById('detailsDisplay').style.display = 'none';
  document.getElementById('revealBtn').style.display = 'inline-block';
  document.getElementById('conjugationBtn').style.display = word.conjugation.some(c => c.form) ? 'inline-block' : 'none';

  displayExamples(word);
  document.getElementById('wordCard').style.display = 'block';
}

function displayExamples(word) {
  const examplesDisplay = document.getElementById('examplesDisplay');
  examplesDisplay.innerHTML = '';

  word.examples.forEach(example => {
    const exampleDiv = document.createElement('div');
    exampleDiv.className = 'mb-2';
    exampleDiv.innerHTML = `
      <p><strong>English:</strong> ${example.english}</p>
      <p><strong>German:</strong> <span class="german-text" style="display: none;">${example.german}</span>
      <button class="btn btn-sm btn-outline-light reveal-german">Reveal German</button></p>
    `;
    examplesDisplay.appendChild(exampleDiv);
  });

  // Add event listeners for reveal buttons
  document.querySelectorAll('.reveal-german').forEach(btn => {
    btn.addEventListener('click', function() {
      this.previousElementSibling.style.display = 'inline';
      this.style.display = 'none';
    });
  });
}

// Event listeners
document.getElementById('englishBtn').addEventListener('click', function() {
  currentLanguage = 'english';
  filterWords();
});

document.getElementById('germanBtn').addEventListener('click', function() {
  currentLanguage = 'german';
  filterWords();
});

document.getElementById('bookFilter').addEventListener('change', filterWords);
document.getElementById('difficultyFilter').addEventListener('change', filterWords);

document.getElementById('revealBtn').addEventListener('click', function() {
  const word = shuffledWords[currentIndex];
  const detailsDisplay = document.getElementById('detailsDisplay');
  detailsDisplay.innerHTML = `
    <hr>
    <p><strong>Translation:</strong> ${word.english}</p>
    ${word.article ? `<p><strong>Article:</strong> ${word.article}</p>` : ''}
    ${word.plural ? `<p><strong>Plural:</strong> ${word.plural}</p>` : ''}
    ${word.feminine ? `<p><strong>Feminine:</strong> ${word.feminine}</p>` : ''}
    ${word.pastPerfect ? `<p><strong>Past Perfect:</strong> ${word.pastPerfect}</p>` : ''}
    ${word.difficultyLevel ? `<p><strong>Difficulty Level:</strong> ${word.difficultyLevel}</p>` : ''}
  `;
  detailsDisplay.style.display = 'block';
  this.style.display = 'none';
});

document.getElementById('conjugationBtn').addEventListener('click', function() {
  const word = shuffledWords[currentIndex];
  const conjugationDisplay = document.getElementById('conjugationDisplay');
  conjugationDisplay.innerHTML = '<hr><h5>Conjugations:</h5><ul>';
  word.conjugation.forEach(conj => {
    if (conj.form) {
      conjugationDisplay.innerHTML += `<li>Person ${conj.person}: ${conj.form}</li>`;
    }
  });
  conjugationDisplay.innerHTML += '</ul>';
  conjugationDisplay.style.display = 'block';
  this.style.display = 'none';
});

document.getElementById('nextBtn').addEventListener('click', function() {
  if (shuffledWords.length > 0) {
    currentIndex = (currentIndex + 1) % shuffledWords.length;
    displayWord();
  }
});

document.getElementById('prevBtn').addEventListener('click', function() {
  if (shuffledWords.length > 0) {
    currentIndex = (currentIndex - 1 + shuffledWords.length) % shuffledWords.length;
    displayWord();
  }
});

populateBookOptions();