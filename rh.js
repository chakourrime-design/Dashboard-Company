
const loadBtn = document.getElementById("loadRH");
loadBtn.addEventListener("click", () => {
  const file = document.getElementById("rhFile").files[0];
  if (!file) return alert("Sélectionnez un fichier CSV");
  const reader = new FileReader();
  reader.onload = (e) => displayRHTable(e.target.result);
  reader.readAsText(file);
});

function displayRHTable(csvText) {
  const rows = csvText.trim().split("\n").map(r => r.split(","));
  const tableContainer = document.getElementById("rhTableContainer");
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  rows[0].forEach(h => { const th = document.createElement("th"); th.textContent = h; headerRow.appendChild(th); });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.slice(1).forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => { const td = document.createElement("td"); td.textContent = cell; tr.appendChild(td); });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

