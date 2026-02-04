let financeChart = null;

const loadBtn = document.getElementById("loadFinance");
loadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("financeFile");
    const file = fileInput.files[0];
    if (!file) return alert("Sélectionnez le fichier CSV");

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        processFinanceData(text);
    };
    reader.readAsText(file);
});

function processFinanceData(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    const separator = lines[0].includes(';') ? ';' : ',';
    const rows = lines.map(line => line.split(separator));

    // Affichage du tableau
    displayTable(rows);

    const labels = [];
    const revenus = [];
    const depenses = [];
    const benefices = [];

    // Extraction des 4 colonnes : Mois, Revenus, Dépenses, Bénéfice
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 4) {
            labels.push(row[0].trim());
            revenus.push(parseFloat(row[1]) || 0);
            depenses.push(parseFloat(row[2]) || 0);
            benefices.push(parseFloat(row[3]) || 0);
        }
    }

    updateFinanceChart(labels, revenus, depenses, benefices);
}

function updateFinanceChart(labels, revenus, depenses, benefices) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (financeChart) financeChart.destroy();

    financeChart = new Chart(ctx, {
        type: 'bar', // Type de base
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenus',
                    data: revenus,
                    backgroundColor: '#22c55e', // Vert
                    borderRadius: 5,
                    order: 2
                },
                {
                    label: 'Dépenses',
                    data: depenses,
                    backgroundColor: '#ef4444', // Rouge
                    borderRadius: 5,
                    order: 2
                },
                {
                    label: 'Bénéfice Net',
                    data: benefices,
                    type: 'line', // Mixte : ligne sur barres
                    borderColor: '#3b82f6', // Bleu
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.3,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#ffffff', font: { size: 14 } } }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' } 
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#94a3b8' } 
                }
            }
        }
    });
}

function displayTable(rows) {
    const container = document.getElementById("financeTableContainer");
    let html = "<table><thead><tr>";
    rows[0].forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";
    rows.slice(1).forEach(row => {
        html += "<tr>" + row.map(cell => `<td>${cell}</td>`).join("") + "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}
