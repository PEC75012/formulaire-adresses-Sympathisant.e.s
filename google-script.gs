
function doPost(e) {
  const feuille = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  const email = data.email;
  const deja = feuille.getDataRange().getValues().some(row => row[4] === email);
  if (deja) return ContentService.createTextOutput("Doublon");

  feuille.appendRow([
    new Date(),
    data.accepte_info,
    data.date_contact || '',
    data.lieu_contact,
    data.lieu_autre || '',
    data.nom,
    data.prenom,
    data.email,
    data.adresse,
    data.adresse_autre || '',
    data.souhaits ? data.souhaits.join(', ') : '',
    data.interets ? data.interets.join(', ') : '',
    data.commentaire || ''
  ]);
  return ContentService.createTextOutput("OK");
}
