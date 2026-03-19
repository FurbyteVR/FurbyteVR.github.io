const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();

        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');
        const statusBox = document.querySelector('.status-box');

        if (!dot || !text || !label) return;

        if (json.success) {
            const data = json.data;
            const status = data.discord_status;
            
            // 1. Kleuren instellen
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            const currentColor = colors[status] || colors.offline;
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 10px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // 2. Spotify Check
            if (data.listening_to_spotify && data.spotify) {
                // Debugging: dit print de Spotify data in je F12 console
                console.log("Spotify Data:", data.spotify);

                const song = data.spotify.track || "Unknown Song";
                const artist = data.spotify.artist || "Unknown Artist";
                
                text.textContent = `Listening to ${song} by ${artist}`;

                if (statusBox && data.spotify.album_art_url) {
                    statusBox.style.backgroundImage = `linear-gradient(rgba(45, 40, 50, 0.85), rgba(45, 40, 50, 0.85)), url('${data.spotify.album_art_url}')`;
                    statusBox.style.backgroundSize = 'cover';
                    statusBox.style.backgroundPosition = 'center';
                }
            } else {
                // 3. Custom Status of Default
                if (statusBox) statusBox.style.backgroundImage = 'none';
                
                const custom = data.activities.find(a => a.type === 4);
                if (custom && custom.state) {
                    text.textContent = `"${custom.state}"`;
                } else {
                    text.textContent = "Expert at doing nothing.";
                }
            }
        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

updateStatus();
setInterval(updateStatus, 15000);
