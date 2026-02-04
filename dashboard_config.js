let chartSalesObj = null;
let chartFinanceObj = null;

document.getElementById('configForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const salesFile = document.getElementById('salesFile').files[0];
    const financeFile = document.getElementById('financeFile').files[0];

    // Lecture des deux fichiers en parallèle
    const [salesRaw, financeRaw] = await Promise.all([
        readFile(salesFile),
        readFile(financeFile)
    ]);

    // Basculer l'affichage
    document.getElementById('configSection').style.display = 'none';
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('pageTitle').innerText = "Tableau de Bord Global";

    renderCharts(salesRaw, financeRaw);
});

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(parseCSV(e.target.result));
        reader.readAsText(file);
    });
}

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const sep = lines[0].includes(';') ? ';' : ',';
    return lines.map(line => line.split(sep).map(c => c.replace(/["']/g, "").trim()));
}

function renderCharts(salesData, financeData) {
    // 1. Graphe Ventes (Ligne)
    const sLabels = salesData.slice(1).map(r => r[0]);
    const sValues = salesData.slice(1).map(r => parseFloat(r[2].replace(',', '.')) || 0);
    
    chartSalesObj = new Chart(document.getElementById('chartSales'), {
        type: 'line',
        data: {
            labels: sLabels,
            datasets: [{ label: 'Ventes', data: sValues, borderColor: '#22c55e', fill: true, backgroundColor: 'rgba(34, 197, 94, 0.1)', tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 2. Graphe Finance (Barres groupées)
    const fLabels = financeData.slice(1).map(r => r[0]);
    const fRev = financeData.slice(1).map(r => parseFloat(r[1]) || 0);
    const fDep = financeData.slice(1).map(r => parseFloat(r[2]) || 0);
    const fBen = financeData.slice(1).map(r => parseFloat(r[3]) || 0);

    chartFinanceObj = new Chart(document.getElementById('chartFinance'), {
        type: 'bar',
        data: {
            labels: fLabels,
            datasets: [
                { label: 'Revenus', data: fRev, backgroundColor: '#22c55e' },
                { label: 'Dépenses', data: fDep, backgroundColor: '#ef4444' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 3. Mise à jour des stats cards
    document.getElementById('txtTotalSales').innerText = sValues.reduce((a, b) => a + b, 0).toLocaleString();
    document.getElementById('txtTotalRev').innerText = fRev.reduce((a, b) => a + b, 0).toLocaleString() + " €";
    document.getElementById('txtTotalBen').innerText = fBen.reduce((a, b) => a + b, 0).toLocaleString() + " €";
}