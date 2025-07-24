
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
    if (this.value === 'Oui') {
      suite.style.display = 'block';
      confirmation.style.display = 'none';
      document.getElementById('date_contact').value = new Date().toLocaleString();
    } else {
      suite.style.display = 'none';
      confirmation.innerText = "Nous vous remercions de votre collaboration, à bientôt peut-être !";
      confirmation.style.display = 'block';
    }
  });
});

document.getElementById('psForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.souhaits = [];
  document.querySelectorAll('input[name="souhaits[]"]:checked').forEach(cb => data.souhaits.push(cb.value));

  data.interets = [];
  document.querySelectorAll('input[name="interets[]"]:checked').forEach(cb => data.interets.push(cb.value));

  fetch('https://script.google.com/macros/s/AKfycbw0r1nRaYFS8V_3zBXZjlQ2NSgSTSZyPvEyo5QllHTJvFGv_y8_ol4bcpTsbL0wR46h/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    document.getElementById('messageConfirmation').innerText = "Nous vous remercions de votre collaboration, à très vite !";
    document.getElementById('messageConfirmation').style.display = 'block';
    form.reset();
    document.getElementById('suiteForm').style.display = 'none';
  });
});
