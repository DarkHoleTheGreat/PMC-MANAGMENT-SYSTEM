// ===============================
// DATE AND TIME
// ===============================

const datetime = document.getElementById("date-time");

function updateDateTime() {
    const now = new Date();
    const options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    datetime.textContent = now.toLocaleString("en-UK", options);
}

setInterval(updateDateTime, 1000);
updateDateTime();


// ===============================
// GAME STATE
// ===============================

const gameState = {
    funds: 200000,
    personnel: [],
    currentMission: null
};


// ===============================
// PERSONNEL
// ===============================

const possibleNames = ["KOVAC", "SMITH", "JOHNSON", "DAVIS", "MILLER"];
const possibleRoles = ["ASSAULT", "SNIPER", "HEAVY", "SUPPORT", "MEDIC"];

function generatePersonnel() {
    const name = possibleNames[Math.floor(Math.random() * possibleNames.length)];
    const role = possibleRoles[Math.floor(Math.random() * possibleRoles.length)];

    const id = gameState.personnel.length + 1;

    return {
        id,
        name,
        role,
        status: "AVAILABLE",
        morale: 100,
        health: 100
    };
}

function hirePersonnel() {
    if (gameState.funds < 10000) return;

    const newPersonnel = generatePersonnel();

    gameState.personnel.push(newPersonnel);
    gameState.funds -= 10000;

    renderRoster();
    updateFundsDisplay();
}

function renderRoster() {
    const body = document.getElementById("roster-body");
    body.innerHTML = "";

    gameState.personnel.forEach(p => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.role}</td>
            <td>${p.status}</td>
            <td>${p.morale}%</td>
            <td>${p.health}%</td>
        `;

        body.appendChild(row);
    });
}


// ===============================
// MISSIONS
// ===============================

const possibleMissionTypes = ["RECON", "ASSAULT", "ESCORT", "DEFENSE"];
const possibleMissionRewards = [5000, 10000, 15000, 20000];

function generateMission() {
    const type = possibleMissionTypes[Math.floor(Math.random() * possibleMissionTypes.length)];
    const reward = possibleMissionRewards[Math.floor(Math.random() * possibleMissionRewards.length)];

    return { type, reward };
}

function createMission() {
    const mission = generateMission();
    gameState.currentMission = mission;
    showMissionDetails(mission);
}

function showMissionDetails(mission) {
    const displayContent = document.querySelector(".display-section .panel-content");

    displayContent.innerHTML = `
        <p>MISSION TYPE: ${mission.type}</p>
        <p>REWARD: $${mission.reward}</p>
        <select id="personnel-select">
            <option value="">Select Personnel</option>
            ${gameState.personnel.map(p =>
                `<option value="${p.id}">${p.name} (${p.role})</option>`
            ).join("")}
        </select>
        <button id="accept-btn">ACCEPT MISSION</button>
    `;

    document.getElementById("accept-btn")
        .addEventListener("click", acceptMission);
}

function acceptMission() {
    const select = document.getElementById("personnel-select");
    const selectedId = parseInt(select.value);

    if (isNaN(selectedId)) return;

    simulateMission(selectedId);
}

function simulateMission(personId) {
    const displayContent = document.querySelector(".display-section .panel-content");
    const success = Math.random() < 0.7;

    if (!gameState.currentMission) return;

    if (success) {
        gameState.funds += gameState.currentMission.reward;

        displayContent.innerHTML = `
            <p>MISSION RESULT: SUCCESS</p>
            <p>REWARD RECEIVED: $${gameState.currentMission.reward}</p>
        `;
    } else {
        // Remove dead personnel
        gameState.personnel = gameState.personnel.filter(p => p.id !== personId);

        displayContent.innerHTML = `
            <p>MISSION RESULT: FAILED</p>
            <p>OPERATIVE LOST</p>
        `;
    }

    gameState.currentMission = null;

    renderRoster();
    updateFundsDisplay();
}


// ===============================
// UI BINDINGS
// ===============================

document.getElementById("hire-btn")
    .addEventListener("click", hirePersonnel);

document.getElementById("mission-btn")
    .addEventListener("click", createMission);


// ===============================
// UPDATES
// ===============================

function updateFundsDisplay() {
    const fundsDisplay = document.getElementById("funds");
    fundsDisplay.textContent = `$${gameState.funds}`;
}

updateFundsDisplay();
