const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  const submitBtn = document.querySelector('#newWordForm button[type="submit"]');

  if (editId) {
    // Load word for editing
    const words = JSON.parse(localStorage.getItem(localStorageKey)) || [];
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

    let words = JSON.parse(localStorage.getItem(localStorageKey)) || [];
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
    localStorage.setItem(localStorageKey, JSON.stringify(words));

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