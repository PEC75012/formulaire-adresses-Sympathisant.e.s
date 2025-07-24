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

  // Affiche ou cache le champ "Autre" selon sélection du lieu
  document.getElementById('lieu_contact').addEventListener('change', function () {
    document.getElementById('lieu_autre').style.display = this.value === 'Autre' ? 'block' : 'none';
  });

  // Affichage conditionnel selon réponse Oui /
