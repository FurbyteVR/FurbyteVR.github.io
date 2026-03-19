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
            "\"Protect your peace like it’s a physical treasure.\""
        ],
        accent: "#C774E8",
        discordId: "416887610233847820",
        style: "default",
        localTime: "Amsterdam, NL (GMT+1)"
    },
    squeakers: {
        name: "OmgItzSqueakers",
        pronouns: "HE/HIM",
        vibe: "Shy but friendly. Single Pringle.",
        mainImg: "./assets/images/friend-main.jpg",
        images: [
            "./assets/images/friend-main.jpg",
            "./assets/images/friend-main.jpg"
        ],
        thoughts: [
            "\"Ask me anything.\"",
            "\"Stay cool, stay icy.\""
        ],
        accent: "#A0FEFE",
        discordId: "VRIEND_DISCORD_ID_HIER", // VERVANG DIT DOOR ZIJN ID
        style: "ice-style",
        localTime: "Austin, TX (GMT-6)"
    }
};

let currentProfileKey = "byte";
let currentGalleryIndex = 0;
let currentThoughtIndex = 0;

async function updateStatus() {
    const profile = PROFILES[currentProfileKey];
    const textElement = document.getElementById('discord-status-text');
    const dot = document.getElementById('status-dot');
    const label = document.getElementById('status-label');
    const statusBox = document.querySelector('.status-box');

    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${profile.discordId}`);
        const json = await response.json();

        if (json.success) {
            const data = json.data;
            const status = data.discord_status;
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            
            dot.style.backgroundColor = colors[status] || colors.offline;
            label.textContent = status.toUpperCase();

            if (data.listening_to_spotify && data.spotify) {
                textElement.textContent = `Listening to ${data.spotify.song}`;
                statusBox.style.backgroundImage = `linear-gradient(rgba(10, 20, 30, 0.85), rgba(10, 20, 30, 0.85)), url('${data.spotify.album_art_url}')`;
                statusBox.style.backgroundSize = 'cover';
            } else {
                statusBox.style.backgroundImage = 'none';
                const custom = data.activities.find(a => a.type === 4);
                textElement.textContent = (custom && custom.state) ? `"${custom.state}"` : profile.vibe;
            }
        }
    } catch (e) {
        textElement.textContent = "Offline or API Error";
    }
}

function updateClock() {
    const timeZone = (currentProfileKey === 'byte') ? 'Europe/Amsterdam' : 'America/Chicago';
    const now = new Date();
    
    const time24 = new Intl.DateTimeFormat('en-GB', { timeZone, hour12: false, hour: '2-digit', minute: '2-digit' }).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', { timeZone, hour12: true, hour: '2-digit', minute: '2-digit' }).format(now);
    
    document.getElementById('clock-24').innerHTML = time24.replace(':', '<span>:</span>');
    document.getElementById('clock-12').textContent = time12;
}

function switchProfile() {
    currentProfileKey = (currentProfileKey === "byte") ? "squeakers" : "byte";
    const data = PROFILES[currentProfileKey];
    const body = document.body;

    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-pronouns').textContent = data.pronouns;
    document.getElementById('profile-vibe').textContent = data.vibe;
    document.getElementById('quote-author').textContent = `— ${data.name.split(' ')[0]}`;
    document.getElementById('profile-main-img').src = data.mainImg;
    document.getElementById('location-text').textContent = data.localTime;
    document.getElementById('gallery-target').src = data.images[0];
    document.getElementById('quote-target').textContent = data.thoughts[0];

    if (data.style === "ice-style") {
        body.classList.add('ice-style');
        document.getElementById('bubble-container').style.display = 'none';
        document.getElementById('snow-container').style.display = 'block';
        createSnowflakes();
    } else {
        body.classList.remove('ice-style');
        document.getElementById('bubble-container').style.display = 'block';
        document.getElementById('snow-container').style.display = 'none';
    }

    document.documentElement.style.setProperty('--accent-glow', data.accent);
    updateStatus();
    updateClock();
}

function createSnowflakes() {
    const container = document.getElementById('snow-container');
    if (container.children.length > 0) return;

    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.width = snowflake.style.height = (Math.random() * 4 + 2) + 'px';
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(snowflake);
    }
}

// Gallery & Thoughts cyclers
setInterval(() => {
    const images = PROFILES[currentProfileKey].images;
    currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
    document.getElementById('gallery-target').src = images[currentGalleryIndex];
}, 10000);

document.getElementById('profile-toggle').addEventListener('click', switchProfile);
setInterval(updateStatus, 15000);
setInterval(updateClock, 1000);
updateStatus();
updateClock();
