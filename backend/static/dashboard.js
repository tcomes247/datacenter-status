async function fetchStatus() {
    const response = await fetch('/status');
    const data = await response.json();
    const container = document.getElementById('providers');
    container.innerHTML = '';

    data.incidents.forEach(incident => {
        const card = document.createElement('div');
        card.className = 'card';

        // Determine the icon based on status
        let statusIcon = '';
        if (incident[1] === 'Up') statusIcon = '/static/images/Up.png';
        else if (incident[1] === 'Down') statusIcon = '/static/images/Down.png';
        else statusIcon = '/static/images/Incident.png';

        card.innerHTML = `
            <h3>${incident[0]}</h3>
            <p>Status: <img src="${statusIcon}" alt="${incident[1]}" width="24" height="24"> ${incident[1]}</p>
            <p>Subject: ${incident[2]}</p>
        `;
        container.appendChild(card);
    });
}

fetchStatus();
setInterval(fetchStatus, 120000);
