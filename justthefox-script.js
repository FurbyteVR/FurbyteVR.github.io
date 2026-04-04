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
                            statusBox.style.backgroundImage = `linear-gradient(rgba(26, 15, 10, 0.88), rgba(26, 15, 10, 0.88)), url('${data.spotify.album_art_url}')`;
                            statusBox.style.backgroundSize = 'cover';
                            statusBox.classList.add('is-listening');
                            statusBox.onclick = () => {
                                window.open(`https://open.spotify.com/track/${data.spotify.track_id}`, '_blank');
                            };
                        }
                    } else {
                        if (statusBox) {
                            statusBox.style.backgroundImage = 'none';
                            statusBox.classList.remove('is-listening');
                            statusBox.onclick = null;
                        }
                        const custom = data.activities.find(a => a.type === 4);
                        text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Probably somewhere being a fox.";
                    }
                    text.classList.remove('fade-out');
                }, 400);
            }
        }
    } catch (e) { console.error(e); }
}

// --- 2. CLOCK (CET = Europe/Warsaw) ---
function updateClock() {
    const now = new Date();
    const options24 = { timeZone: 'Europe/Warsaw', hour12: false, hour: '2-digit', minute: '2-digit' };
    const options12 = { timeZone: 'Europe/Warsaw', hour12: true,  hour: '2-digit', minute: '2-digit' };
    const time24 = new Intl.DateTimeFormat('nl-NL', options24).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', options12).format(now);
    const clock24 = document.getElementById('clock-24');
    const clock12 = document.getElementById('clock-12');
    if (clock24) clock24.innerHTML = time24.replace(':', '<span>:</span>');
    if (clock12) clock12.textContent = time12;
}

// --- 3. GALLERY SLIDESHOW ---
// Verander deze naar JustTheFox0's echte afbeeldingen!
const galleryImages = [
    "./assets/images/justthefox-main.jpg",
    "./assets/images/justthefox-2.jpg",
    "./assets/images/justthefox-3.jpg",
];
let currentGalleryIndex = 0;
const galleryTarget = document.getElementById('gallery-target');

function cycleGallery() {
    if (!galleryTarget || galleryImages.length <= 1) return;
    galleryTarget.classList.add('fade-out');
    setTimeout(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        galleryTarget.src = galleryImages[currentGalleryIndex];
        galleryTarget.onload = () => { galleryTarget.classList.remove('fade-out'); };
    }, 500);
}

// --- 4. THOUGHTS CYCLE ---
const thoughtList = [
    '"Chasing sunsets and good vibes."',
    '"DMs open, don\'t be shy."',
    '"Every fox has their own kind of magic."',
    '"Poland represent 🇵🇱"',
    '"VRChat is just life but better."',
    '"Being 20 means I still have no idea what I\'m doing and that\'s fine."',
    '"The trick is to look confident even when you\'re lost."',
    '"Sunsets hit different when you\'re a fox."',
    '"Not just a fox. THE fox."',
    '"Good vibes or no vibes."',
    '"Some days you\'re the hunter, some days you\'re just vibing in the forest."',
    '"JustTheFox0 but make it fashion."',
];
let currentThoughtIndex = 0;
const quoteTarget = document.getElementById('quote-target');

function cycleThoughts() {
    if (!quoteTarget || thoughtList.length <= 1) return;
    quoteTarget.classList.add('fade-out');
    setTimeout(() => {
        currentThoughtIndex = (currentThoughtIndex + 1) % thoughtList.length;
        quoteTarget.textContent = thoughtList[currentThoughtIndex];
        quoteTarget.classList.remove('fade-out');
    }, 500);
}

// --- 5. EMBER PARTICLES ---
function spawnEmbers() {
    const container = document.getElementById('ember-container');
    if (!container) return;
    for (let i = 0; i < 18; i++) {
        const ember = document.createElement('div');
        ember.className = 'ember';
        const size = Math.random() * 6 + 2;
        ember.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 14 + 8}s;
            animation-delay: ${Math.random() * 16}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        container.appendChild(ember);
    }
}

// --- START ---
updateStatus();
setInterval(updateStatus, 15000);
updateClock();
setInterval(updateClock, 1000);
spawnEmbers();

if (galleryTarget && galleryImages.length > 1) {
    setInterval(cycleGallery, 10000);
}
if (quoteTarget && thoughtList.length > 1) {
    setInterval(cycleThoughts, 20000);
}
