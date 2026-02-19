// ===============================
// DEVELOPER QUALITY OF LIFE
// ===============================

function getDisplay() {
    return document.querySelector(".display-section .panel-content");
}

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
    nextPersonnelID: 1,
    personnel: [],
    availableMissions: [],
    assignedPersonnel: [],
    chossingPersonnel: false,
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

    const id = gameState.nextPersonnelID++;

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
    let missionRequiredPersonnel = Math.floor(Math.random() * 12) + 1; // 1 to 3 personnel required

    return { type, reward, missionRequiredPersonnel };
}

function openMissionBoard() {
    gameState.availableMissions = [
        generateMission(),
        generateMission(),
        generateMission()
    ];

    renderMissionList();
}

function renderMissionList() {
    const display = getDisplay();

    display.innerHTML = gameState.availableMissions.map((m, index) => `
            <div class="mission-card" data-index="${index}">
                <p>MISSION: ${m.type}</p>
                <p>REWARD: $${m.reward}</p>
                <p>REQUIRED PERSONNEL: ${m.missionRequiredPersonnel}</p>
            </div>
        `).join("")
    
    document.querySelectorAll(".mission-card")
        .forEach(card => {
            card.addEventListener("click", selectMission);
        });
}

function selectMission(e) {
    const index = e.currentTarget.dataset.index;
    gameState.selectedMission = gameState.availableMissions[index];

    if (gameState.personnel.length === 0) {
        const display = getDisplay();
        display.innerHTML = `
            <p>NO AVAILABLE PERSONNEL</p>
            <p>HIRE SOMEONE BEFORE TAKING ON THIS MISSIONS</p>
        `;
    }
    else {
        gameState.chossingPersonnel = true;
        renderMissionAssignment();
    }
    console.log(gameState.availableMissions[index])
}

function renderMissionAssignment() {
    const display = getDisplay();

    display.innerHTML = `
        <p>MISSION: ${gameState.selectedMission.type}</p>
        <p>REWARD: $${gameState.selectedMission.reward}</p>
        <p>REQUIRED PERSONNEL: ${gameState.assignedPersonnel.length}/${gameState.selectedMission.missionRequiredPersonnel} (CHOSE PERSONNEL BY CLIKING ON OPERATOR IN THE LIST)</p>

        <select id="personnel-select">
            ${gameState.personnel.map(p =>
                `<option value="${p.id}">${p.name} (${p.role})</option>`
            ).join("")}
        </select>
        <br>
        <button id="start-btn">[ START ]</button>
        <button id="cancel-btn">[ CANCEL ]</button>
    `;

    // if (gameState.chossingPersonnel) {
    // document.getElementById("roster-body").querySelectorAll("tr")
    //     .forEach(row => {
    //         row.addEventListener("click", () => {
    //             row.classList.toggle("selected-row");
    //             const id = parseInt(row.children[0].textContent);

    //             if (gameState.assignedPersonnel.includes(id)) {
    //                 gameState.assignedPersonnel = gameState.assignedPersonnel.filter(pid => pid !== id);
    //             } else {
    //                 if (gameState.assignedPersonnel.length < gameState.selectedMission.missionRequiredPersonnel) {
    //                     gameState.assignedPersonnel.push(id);
    //                 } else {
    //                     alert("You have already assigned the required number of personnel for this mission.");
    //                 }
    //             }

    //         });
    //     });
    // }

    document.getElementById("start-btn")
        .addEventListener("click", () => {
            const select = document.getElementById("personnel-select");
            const personID = parseInt(select.value);

            if (isNaN(personID)) return;

            simulateMission(personID);
        });

    document.getElementById("cancel-btn")
        .addEventListener("click", renderMissionList);
    
    
}

function simulateMission(personId) {
    const displayContent = getDisplay();
    const success = Math.random() < 0.7;

    if (!gameState.selectedMission) return;

    if (success) {
        gameState.funds += gameState.selectedMission.reward;

        displayContent.innerHTML = `
            <p>MISSION RESULT: SUCCESS</p>
            <p>REWARD RECEIVED: $${gameState.selectedMission.reward}</p>
        `;
    } else {
        // Remove dead personnel
        gameState.personnel = gameState.personnel.filter(p => p.id !== personId);

        displayContent.innerHTML = `
            <p>MISSION RESULT: FAILED</p>
            <p>OPERATIVE LOST</p>
        `;
    }

    gameState.selectedMission = null;

    renderRoster();
    updateFundsDisplay();
}


// ===============================
// UI BINDINGS
// ===============================

document.getElementById("hire-btn")
    .addEventListener("click", hirePersonnel);

document.getElementById("mission-btn")
    .addEventListener("click", openMissionBoard);


// ===============================
// UPDATES
// ===============================

function updateFundsDisplay() {
    const fundsDisplay = document.getElementById("funds");
    fundsDisplay.textContent = `$${gameState.funds}`;
}

updateFundsDisplay();
