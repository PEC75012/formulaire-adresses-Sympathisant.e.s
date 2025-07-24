(function() {
  let adresses = [];

  fetch('adresses.json')
    .then(res => res.json())
    .then(data => adresses = data);

  const adresseInput = document.getElementById('adresse');
  const suggestionBox = document.getElementById('suggestions');

  adresseInput.addEventListener('input', function () {
    const value = this.value.toLowerCase();
    suggestionBox.innerHTML = '';
    if (!value) {
      suggestionBox.style.display = 'none';
      return;
    }
    const matches = adresses.filter(addr => addr.toLowerCase().includes(value)).slice(0, 10);
    matches.forEach(match => {
      const div = document.createElement('div');
      div.className = 'suggestion';
      div.textContent = match;
      div.addEventListener('click', () => {
        adresseInput.value = match;
        suggestionBox.innerHTML = '';
        suggestionBox.style.display = 'none';
      });
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = matches.length ? 'block' : 'none';
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.autocomplete-wrapper')) {
      suggestionBox.style.display = 'none';
    }
  });

  document.getElementById('lieu_contact').addEventListener('change', function () {
    document.getElementById('lieu_autre').style.display = this.value === 'Autre' ? 'block' : 'none';
  });

  document.getElementsByName('accepte_info').forEach(radio => {
    radio.addEventListener('change', function () {
      const suite = document.getElementById('suiteForm');
      const confirmation = document.getElementById('messageConfirmation');
      const submitBtn = document.querySelector('button[type="submit"]');
      if (this.value === 'Oui') {
        suite.style.display = 'block';
        confirmation.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        document.getElementById('date_contact').value = new Date().toLocaleString();
      } else {
        suite.style.display = 'none';
        confirmation.innerText = "Nous vous remercions de votre collaboration, à bientôt peut-être !";
        confirmation.style.display = 'block';
        submitBtn.style.display = 'none';
      }
    });
  });

  document.getElementById('psForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.souhaits = [];
    document.querySelectorAll('input[name="souhaits[]"]:checked').forEach(cb => data.souhaits.push(cb.value));
    data.interets = [];
    document.querySelectorAll('input[name="interets[]"]:checked').forEach(cb => data.interets.push(cb.value));

    fetch('https://script.google.com/macros/s/AKfycbzKzs7Dra-S40IsUZRJVYeaZGLVNcnkrRkd8p7C9kZQyYaMI33g7NanClJ0X1EAMBc87Q/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      submitBtn.classList.remove('loading');
      document.getElementById('messageConfirmation').innerText = "Nous vous remercions de votre collaboration, à très vite !";
      document.getElementById('messageConfirmation').style.display = 'block';
      form.reset();
      document.getElementById('suiteForm').style.display = 'none';
    });
  });
})();
