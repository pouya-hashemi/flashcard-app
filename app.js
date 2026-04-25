// Load initial data from data.json if not in localStorage
async function loadData() {
  if (!localStorage.getItem('words')) {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      localStorage.setItem('words', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading data.json:', error);
      localStorage.setItem('words', JSON.stringify([]));
    }
  }
}

// Add example functionality
document.getElementById('addExample').addEventListener('click', function () {
  const container = document.getElementById('examplesContainer');
  const newRow = document.createElement('div');
  newRow.className = 'example-row row mb-3';
  newRow.innerHTML = `
    <div class="col-md-5 mb-3">
      <label class="form-label">English Example</label>
      <input type="text" class="form-control" name="exEng[]">
    </div>
    <div class="col-md-5 mb-3">
      <label class="form-label">German Example</label>
      <input type="text" class="form-control" name="exGer[]">
    </div>
    <div class="col-md-2 mb-3 d-flex align-items-end">
      <button type="button" class="btn btn-danger remove-example">Remove</button>
    </div>
  `;
  container.appendChild(newRow);
});

// Remove example
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-example')) {
    e.target.closest('.example-row').remove();
  }
});

// Form submission
document.getElementById('newWordForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const word = {
    id: Date.now().toString(), // Simple ID generation
    german: formData.get('german'),
    article: formData.get('article'),
    english: formData.get('english'),
    plural: formData.get('plural'),
    feminine: formData.get('feminine'),
    pastPerfect: formData.get('pastPerfect'),
    conjugation: [
      { person: 1, form: formData.get('conj1') },
      { person: 2, form: formData.get('conj2') },
      { person: 3, form: formData.get('conj3') },
      { person: 4, form: formData.get('conj4') },
      { person: 5, form: formData.get('conj5') },
      { person: 6, form: formData.get('conj6') }
    ],
    examples: []
  };

  // Collect examples
  const exEng = formData.getAll('exEng[]');
  const exGer = formData.getAll('exGer[]');
  for (let i = 0; i < exEng.length; i++) {
    if (exEng[i] || exGer[i]) {
      word.examples.push({ english: exEng[i], german: exGer[i] });
    }
  }

  // Load existing words
  let words = JSON.parse(localStorage.getItem('words')) || [];
  words.push(word);
  localStorage.setItem('words', JSON.stringify(words));

  // Reset form
  this.reset();
  // Remove extra examples
  const container = document.getElementById('examplesContainer');
  const rows = container.querySelectorAll('.example-row');
  for (let i = 1; i < rows.length; i++) {
    rows[i].remove();
  }

});

// Initialize
loadData();

// Index page functionality
if (document.getElementById('searchBtn')) {
  let allWords = [];
  let displayedCount = 0;
  const resultsDiv = document.getElementById('results');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  document.getElementById('searchBtn').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.toLowerCase();
    allWords = JSON.parse(localStorage.getItem('words')) || [];
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
              ${word.conjugation.some(c => c.form) ? 'Conjugation: ' + word.conjugation.map(c => c.form).filter(f => f).join(', ') + '<br>' : ''}
              ${word.examples.length ? 'Examples: ' + word.examples.map(e => e.german + ' - ' + e.english).join('; ') : ''}
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-warning btn-sm me-2 edit-btn" data-id="${word.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${word.id}">Delete</button>
          </div>
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

  // Edit and Delete
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;
      window.location.href = 'createWord.html?edit=' + id;
    }
    else if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this word?')) {
        let words = JSON.parse(localStorage.getItem('words')) || [];
        words = words.filter(word => word.id !== id);
        localStorage.setItem('words', JSON.stringify(words));
        // Re-search to update display
        document.getElementById('searchBtn').click();
      }
    }
  });
}

// Create/Edit page functionality
if (document.getElementById('newWordForm')) {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  const submitBtn = document.querySelector('#newWordForm button[type="submit"]');

  if (editId) {
    // Load word for editing
    const words = JSON.parse(localStorage.getItem('words')) || [];
    const word = words.find(w => w.id === editId);
    if (word) {
      document.getElementById('wordId').value = word.id;
      document.getElementById('german').value = word.german;
      document.getElementById('article').value = word.article;
      document.getElementById('english').value = word.english;
      document.getElementById('plural').value = word.plural;
      document.getElementById('feminine').value = word.feminine;
      document.getElementById('pastPerfect').value = word.pastPerfect;
      document.getElementById('conj1').value = word.conjugation[0]?.form || '';
      document.getElementById('conj2').value = word.conjugation[1]?.form || '';
      document.getElementById('conj3').value = word.conjugation[2]?.form || '';
      document.getElementById('conj4').value = word.conjugation[3]?.form || '';
      document.getElementById('conj5').value = word.conjugation[4]?.form || '';
      document.getElementById('conj6').value = word.conjugation[5]?.form || '';

      // Clear existing examples
      const container = document.getElementById('examplesContainer');
      container.innerHTML = '';

      // Add examples
      word.examples.forEach(ex => {
        const newRow = document.createElement('div');
        newRow.className = 'example-row row mb-3';
        newRow.innerHTML = `
          <div class="col-md-5 mb-3">
            <label class="form-label">English Example</label>
            <input type="text" class="form-control" name="exEng[]" value="${ex.english}">
          </div>
          <div class="col-md-5 mb-3">
            <label class="form-label">German Example</label>
            <input type="text" class="form-control" name="exGer[]" value="${ex.german}">
          </div>
          <div class="col-md-2 mb-3 d-flex align-items-end">
            <button type="button" class="btn btn-danger remove-example">Remove</button>
          </div>
        `;
        container.appendChild(newRow);
      });

      submitBtn.textContent = 'Update Word';
    }
  }

  // Form submission (add or update)
  document.getElementById('newWordForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const wordId = formData.get('wordId');
    const word = {
      id: wordId || Date.now().toString(),
      german: formData.get('german'),
      article: formData.get('article'),
      english: formData.get('english'),
      plural: formData.get('plural'),
      feminine: formData.get('feminine'),
      pastPerfect: formData.get('pastPerfect'),
      conjugation: [
        { person: 1, form: formData.get('conj1') },
        { person: 2, form: formData.get('conj2') },
        { person: 3, form: formData.get('conj3') },
        { person: 4, form: formData.get('conj4') },
        { person: 5, form: formData.get('conj5') },
        { person: 6, form: formData.get('conj6') }
      ],
      examples: []
    };

    // Collect examples
    const exEng = formData.getAll('exEng[]');
    const exGer = formData.getAll('exGer[]');
    for (let i = 0; i < exEng.length; i++) {
      if (exEng[i] || exGer[i]) {
        word.examples.push({ english: exEng[i], german: exGer[i] });
      }
    }

    let words = JSON.parse(localStorage.getItem('words')) || [];
    if (wordId) {
      // Update
      const index = words.findIndex(w => w.id === wordId);
      if (index !== -1) {
        words[index] = word;
      }
    } else {
      // Add
      words.push(word);
    }
    localStorage.setItem('words', JSON.stringify(words));

    // Reset form
    this.reset();
    document.getElementById('wordId').value = '';
    // Remove extra examples
    const container = document.getElementById('examplesContainer');
    const rows = container.querySelectorAll('.example-row');
    for (let i = 1; i < rows.length; i++) {
      rows[i].remove();
    }

    submitBtn.textContent = 'Create Word';
    alert(wordId ? 'Word updated successfully!' : 'Word added successfully!');
  });
}