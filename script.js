/**
 * Asynchronous integration with the Lanyard API for Discord Status tracking.
 * Requires the user to join the Lanyard Discord server.
 */

// The Discord ID must be replaced with the user's actual 18-digit Discord ID
const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// DOM Element Selectors
const statusTextElement = document.getElementById('discord-status-text');
const statusDotElement = document.getElementById('status-dot');

/**
 * Fetches data from the Lanyard REST API and updates the UI
 */
async function fetchDiscordStatus() {
    try {
        const response = await fetch(LANYARD_API_URL);
        const data = await response.json();

        if (data.success) {
            const presence = data.data;
            updateStatusUI(presence);
        } else {
            console.warn("Lanyard API returned unsuccessful status. User may not be in the server.");
        }
    } catch (error) {
        console.error("Failed to fetch Discord status:", error);
    }
}

/**
 * Updates the text and color indicators based on Discord presence data
 * @param {Object} presence - The data object returned from Lanyard
 */
function updateStatusUI(presence) {
    // 1. Update the Status Dot Color
    const statusColors = {
        online: '#43b581',    // Discord Green
        idle: '#faa61a',      // Discord Yellow
        dnd: '#f04747',       // Discord Red
        offline: '#747f8d'    // Discord Grey
    };
    
    const currentStatusColor = statusColors[presence.discord_status] |

| statusColors.offline;
    statusDotElement.style.backgroundColor = currentStatusColor;
    statusDotElement.style.boxShadow = `0 0 12px ${currentStatusColor}`;

    // 2. Update the Text based on Custom Status or Activity
    // If the user has a custom status set in Discord, display it
    if (presence.activities && presence.activities.length > 0) {
        const customStatus = presence.activities.find(activity => activity.type === 4);
        
        if (customStatus && customStatus.state) {
            statusTextElement.textContent = `"${customStatus.state}"`;
            return; // Exit function early if custom status is found
        }
    }

    // Default Fallback Text if no custom status is active
    if (presence.discord_status === 'offline') {
        statusTextElement.textContent = "Sleeping... expert at doing nothing.";
    } else {
        statusTextElement.textContent = "Expert at doing nothing.";
    }
}

// Initialize the fetch sequence on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDiscordStatus();
    
    // Optional: Set an interval to poll the API every 30 seconds for live updates
    setInterval(fetchDiscordStatus, 30000);
});
