const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// --- 1. LANYARD STATUS ---
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
            
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            const currentColor = colors[status] || colors.offline;
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 10px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // Start Fade Effect
            text.classList.add('fade-out');

            setTimeout(() => {
                if (data.listening_to_spotify && data.spotify) {
                    const song = data.spotify.song || data.spotify.track || "A song";
                    const artist = data.spotify.artist || "Unknown Artist";
                    text.textContent = `Listening to ${song} by ${artist}`;

                    if (statusBox && data.spotify.album_art_url) {
                        statusBox.style.backgroundImage = `linear-gradient(rgba(30, 27, 36, 0.9), rgba(30, 27, 36, 0.9)), url('${data.spotify.album_art_url}')`;
                        statusBox.style.backgroundSize = 'cover';
                        statusBox.style.backgroundPosition = 'center';
                    }
                } else {
                    if (statusBox) statusBox.style.backgroundImage = 'none';
                    const custom = data.activities.find(a => a.type === 4);
                    text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Expert at doing nothing.";
                }
                text.classList.remove('fade-out');
            }, 400);
        }
    } catch (e) { console.error("Lanyard error:", e); }
}

// --- 2. AMSTERDAM CLOCK ---
function updateClock() {
    const now = new Date();
    const options24 = { timeZone: 'Europe/Amsterdam', hour12: false, hour: '2-digit', minute: '2-digit' };
    const options12 = { timeZone: 'Europe/Amsterdam', hour12: true, hour: '2-digit', minute: '2-digit' };

    const time24 = new Intl.DateTimeFormat('nl-NL', options24).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', options12).format(now);

    const clock24 = document.getElementById('clock-24');
    const clock12 = document.getElementById('clock-12');

    if (clock24 && clock12) {
        clock24.innerHTML = time24.replace(':', '<span>:</span>');
        clock12.textContent = time12;
    }
}

// Start Loops
updateStatus();
setInterval(updateStatus, 15000);
updateClock();
setInterval(updateClock, 1000);
