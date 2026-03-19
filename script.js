async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json(); // Lanyard stuurt { success: true, data: { ... } }

        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');

        if (!dot || !text || !label) return;

        if (json.success) {
            const userData = json.data; // De eigenlijke info zit in de 'data' property
            const status = userData.discord_status;
            
            const colors = {
                online: '#43b581',
                idle: '#faa61a',
                dnd: '#f04747',
                offline: '#747f8d'
            };

            // FIX: Geen spaties tussen de ||
            const currentColor = colors[status] || colors.offline;
            
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 15px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // Zoek naar custom status (Type 4)
            const custom = userData.activities.find(a => a.type === 4);
            
            if (custom && custom.state) {
                text.textContent = `"${custom.state}"`;
            } else if (userData.listening_to_spotify && userData.spotify) {
                text.textContent = `Listening to ${userData.spotify.track}`; // Let op: .track ipv .song
            } else {
                text.textContent = "Expert at doing nothing.";
            }
        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}
