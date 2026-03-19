// --- CONFIGURATION ---
const PROFILES = {
    byte: {
        name: "BYTE",
        pronouns: "HE/HIM",
        vibe: "Quiet & cozy. Staying in my own little bubble.",
        mainImg: "./assets/images/byte-sunset.jpg",
        images: [
            "./assets/images/byte-dark.jpg",
            "./assets/images/byte-camera.jpg",
            "./assets/images/byte-flex.jpg",
            "./assets/images/byte-room.jpg"
        ],
        thoughts: [
            "\"Silence is not empty, it's full of answers.\"",
            "\"Collect moments, not things.\"",
            "\"Normality is a paved road: comfortable, but no flowers grow.\""
        ],
        accent: "#C774E8",
        discordId: "416887610233847820"
    },
    friend: {
        name: "FRIEND NAME",
        pronouns: "THEY/THEM",
        vibe: "Always up for chaos and coffee. Living fast.",
        mainImg: "./assets/images/friend-main.jpg", // Change this!
        images: [
            "./assets/images/friend-1.jpg",
            "./assets/images/friend-2.jpg"
        ],
        thoughts: [
            "\"Coffee first, questions later.\"",
            "\"Chaos is a ladder.\"",
            "\"Stay hungry, stay foolish.\""
        ],
        accent: "#43b581", // Green accent for friend
        discordId: "YOUR_FRIENDS_ID_HERE" // Change this!
    }
};

let currentProfileKey = "byte";
let currentGalleryIndex = 0;
let currentThoughtIndex = 0;

// --- CORE FUNCTIONS ---

async function updateStatus() {
    const profile = PROFILES[currentProfileKey];
    const LANYARD_URL = `https://api.lanyard.rest/v1/users/${profile.discordId}`;
    
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
                        text.textContent = `Listening to ${data.spotify.song} by ${data.spotify.artist}`;
                        if (statusBox) {
                            statusBox.style.backgroundImage = `linear-gradient(rgba(30, 27, 36, 0.9), rgba(30, 27, 36, 0.9)), url('${data.spotify.album_art_url}')`;
                            statusBox.style.backgroundSize = 'cover';
                            statusBox.classList.add('is-listening');
                            statusBox.onclick = () => window.open(`https://open.spotify.com/track/${data.spotify.track_id}`, '_blank');
                        }
                    } else {
                        if (statusBox) {
                            statusBox.style.backgroundImage = 'none';
                            statusBox.classList.remove('is-listening');
                            statusBox.onclick = null;
                        }
                        const custom = data.activities.find(a => a.type === 4);
                        text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Expert at doing nothing.";
                    }
                    text.classList.remove('fade-out');
                }, 400);
            }
        }
    } catch (e) { console.error(e); }
}

function updateClock() {
    const now = new Date();
    const options24 = { timeZone: 'Europe/Amsterdam', hour12: false, hour: '2-digit', minute: '2-digit' };
    const options12 = { timeZone: 'Europe/Amsterdam', hour12: true, hour: '2-digit', minute: '2-digit' };
    const time24 = new Intl.DateTimeFormat('en-GB', options24).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', options12).format(now);
    const clock24 = document.getElementById('clock-24');
    const clock12 = document.getElementById('clock-12');
    if (clock24) clock24.innerHTML = time24.replace(':', '<span>:</span>');
    if (clock12) clock12.textContent = time12;
}

function cycleGallery() {
    const galleryTarget = document.getElementById('gallery-target');
    const images = PROFILES[currentProfileKey].images;
    if (!galleryTarget || images.length <= 1) return;

    galleryTarget.classList.add('fade-out');
    setTimeout(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
        galleryTarget.src = images[currentGalleryIndex];
        galleryTarget.onload = () => galleryTarget.classList.remove('fade-out');
    }, 500);
}

function cycleThoughts() {
    const quoteTarget = document.getElementById('quote-target');
    const thoughts = PROFILES[currentProfileKey].thoughts;
    if (!quoteTarget || thoughts.length <= 1) return;

    quoteTarget.classList.add('fade-out');
    setTimeout(() => {
        currentThoughtIndex = (currentThoughtIndex + 1) % thoughts.length;
        quoteTarget.textContent = thoughts[currentThoughtIndex];
        quoteTarget.classList.remove('fade-out');
    }, 500);
}

// --- PROFILE SWITCHER ---

function switchProfile() {
    currentProfileKey = (currentProfileKey === "byte") ? "friend" : "byte";
    const data = PROFILES[currentProfileKey];

    // Update Text
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-pronouns').textContent = data.pronouns;
    document.getElementById('profile-vibe').textContent = data.vibe;
    document.getElementById('quote-author').textContent = `— ${data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase()}`;
    
    // Update Main Profile Image
    document.getElementById('profile-main-img').src = data.mainImg;

    // Reset Gallery & Thoughts
    currentGalleryIndex = 0;
    currentThoughtIndex = 0;
    document.getElementById('gallery-target').src = data.images[0];
    document.getElementById('quote-target').textContent = data.thoughts[0];

    // Update Accent Color
    document.documentElement.style.setProperty('--accent-glow', data.accent);

    // Refresh Discord Status
    updateStatus();
}

// --- INITIALIZE ---
document.getElementById('profile-toggle').addEventListener('click', switchProfile);

updateStatus();
setInterval(updateStatus, 15000);
updateClock();
setInterval(updateClock, 1000);
setInterval(cycleGallery, 10000);
setInterval(cycleThoughts, 20000);
