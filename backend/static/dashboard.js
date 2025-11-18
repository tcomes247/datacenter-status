async function loadIncidents() {
    const response = await fetch("/incidents");
    const data = await response.json();

    const tbody = document.getElementById("incident-body");
    tbody.innerHTML = "";

    data.incidents.forEach(i => {
        const row = `
        <tr>
            <td>${i[0]}</td>
            <td>${i[1]}</td>
            <td>${i[2]}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Load immediately
loadIncidents();

// Refresh every 120 seconds
setInterval(loadIncidents, 120000);
