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
document.getElementById('addExample').addEventListener('click', function() {
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
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-example')) {
    e.target.closest('.example-row').remove();
  }
});

// Form submission
document.getElementById('newWordForm').addEventListener('submit', function(e) {
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
  
  alert('Word added successfully!');
});

// Initialize
loadData();