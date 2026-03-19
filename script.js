const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();

        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');

        if (!dot || !text || !label) return;

        if (json.success) {
            const data = json.data;
            const status = data.discord_status;
            
            const colors = {
                online: '#43b581',
                idle: '#faa61a',
                dnd: '#f04747',
                offline: '#747f8d'
            };

            // Zorg dat dit precies zo staat: || zonder spaties ertussen
            const currentColor = colors[status] || colors.offline;
            
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 10px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // Zoek naar Spotify of Custom Status
            if (data.listening_to_spotify && data.spotify) {
                text.textContent = `Listening to ${data.spotify.track}`;
            } else {
                const custom = data.activities.find(a => a.type === 4);
                text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Expert at doing nothing.";
            }
        } else if (json.error && json.error.code === "user_not_monitored") {
            text.textContent = "Please join the Lanyard Discord.";
            label.textContent = "ERROR";
            dot.style.backgroundColor = "#ff4747";
        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

updateStatus();
setInterval(updateStatus, 15000);
