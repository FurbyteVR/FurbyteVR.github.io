const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// --- STATUS UPDATE ---
async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');
        const statusBox = document.querySelector('.status-box');

        if (json.success) {
            const data = json.data;
            const status = data.discord_status;
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            const currentColor = colors[status] || colors.offline;

            if (dot) {
                dot.style.backgroundColor = currentColor;
                dot.style.boxShadow = `0 0 10px ${currentColor}`;
            }
            if (label) label.textContent = status.toUpperCase();

            if (text) {
                text.classList.add('fade-out');
                setTimeout(() => {
                    if (data.listening_to_spotify && data.spotify) {
                        text.textContent = `Listening to ${data.spotify.song || data.spotify.track} by ${data.spotify.artist}`;
                        if (statusBox) {
                            statusBox.style.backgroundImage = `linear-gradient(rgba(30, 27, 36, 0.9), rgba(30, 27, 36, 0.9)), url('${data.spotify.album_art_url}')`;
                            statusBox.style.backgroundSize = 'cover';
                        }
                    } else {
                        if (statusBox) statusBox.style.backgroundImage = 'none';
                        const custom = data.activities.find(a => a.type === 4);
                        text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Expert at doing nothing.";
                    }
                    text.classList.remove('fade-out');
                }, 400);
            }
        }
    } catch (e) { console.error(e); }
}

// --- CLOCK ---
function updateClock() {
    const now = new Date();
    const opt = { timeZone: 'Europe/Amsterdam', hour12: false, hour: '2-digit', minute: '2-digit' };
    const opt12 = { timeZone: 'Europe/Amsterdam', hour12: true, hour: '2-digit', minute: '2-digit' };
    
    const t24 = new Intl.DateTimeFormat('nl-NL', opt).format(now);
    const t12 = new Intl.DateTimeFormat('en-US', opt12).format(now);

    const c24 = document.getElementById('clock-24');
    const c12 = document.getElementById('clock-12');
    if (c24) c24.innerHTML = t24.replace(':', '<span>:</span>');
    if (c12) c12.textContent = t12;
}

updateStatus();
setInterval(updateStatus, 15000);
updateClock();
setInterval(updateClock, 1000);
