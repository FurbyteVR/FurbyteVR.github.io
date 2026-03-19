const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const data = await response.json();

        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');

        if (!dot ||!text ||!label) return;

        // Check of Lanyard de user al volgt
        if (data.error && data.error.code === "user_not_monitored") {
            text.textContent = "Lanyard server check...";
            label.textContent = "JOIN LANYARD DISCORD";
            dot.style.backgroundColor = "#ff4747"; 
            return;
        }

        if (data.success) {
            const status = data.data.discord_status;
            const colors = {
                online: '#43b581',
                idle: '#faa61a',
                dnd: '#f04747',
                offline: '#747f8d'
            };

            // FIX: De pipes |

| staan nu weer netjes op één regel
            const currentColor = colors[status] |

| colors.offline;
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 15px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // Zoek naar custom status of Spotify
            const custom = data.data.activities.find(a => a.type === 4);
            if (custom && custom.state) {
                text.textContent = `"${custom.state}"`;
            } else if (data.data.listening_to_spotify) {
                text.textContent = `Listening to ${data.data.spotify.song}`;
            } else {
                text.textContent = "Expert at doing nothing.";
            }
        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

updateStatus();
setInterval(updateStatus, 15000);
