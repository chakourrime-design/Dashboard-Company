let salesChart = null;

const loadBtn = document.getElementById("loadSales");
loadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("salesFile");
    const file = fileInput.files[0];
    if (!file) return alert("Veuillez choisir un fichier CSV.");

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        processData(text);
    };
    reader.readAsText(file);
});

function processData(csvText) {
    // 1. Découpage des lignes
    const lines = csvText.trim().split(/\r?\n/).filter(l => l !== "");
    const separator = lines[0].includes(';') ? ';' : ',';
    
    const rows = lines.map(line => line.split(separator));
    
    // 2. Affichage du Tableau
    renderTable(rows);

    // 3. Extraction des données pour le Graphe
    const labels = [];
    const values = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 3) {
            // Mois (Col 0)
            labels.push(row[0].replace(/["']/g, "").trim());
            // Valeur (Col 2) - On nettoie les guillemets et espaces
            let val = row[2].replace(/["']/g, "").replace(/\s/g, "").replace(',', '.');
            values.push(parseFloat(val) || 0);
        }
    }

    renderChart(labels, values);
}

function renderTable(rows) {
    const container = document.getElementById("salesTableContainer");
    let html = "<table><thead><tr>";
    
    // En-têtes
    rows[0].forEach(col => html += `<th>${col.replace(/["']/g, "")}</th>`);
    html += "</tr></thead><tbody>";
    
    // Données
    rows.slice(1).forEach(row => {
        html += "<tr>";
        row.forEach(cell => html += `<td>${cell.replace(/["']/g, "")}</td>`);
        html += "</tr>";
    });
    
    html += "</tbody></table>";
    container.innerHTML = html;
}

function renderChart(labels, values) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    if (salesChart) salesChart.destroy();

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Volume des Ventes',
                data: values,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#ffffff' } }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: '#022c22' },
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