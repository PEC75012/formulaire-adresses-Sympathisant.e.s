function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  const email = data.email;
  const existing = sheet.getDataRange().getValues().some(row => row[2] === email);
  if (existing) return ContentService.createTextOutput("Email déjà utilisé");

  sheet.appendRow([
    new Date(),
    data.prenom,
    data.nom,
    data.email,
    data.telephone,
    data.adresse,
    data.interets
  ]);
  return ContentService.createTextOutput("OK");
}
