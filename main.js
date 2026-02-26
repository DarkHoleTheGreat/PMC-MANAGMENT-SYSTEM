//date and time

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

//Dev quality of life
function getDisplay() {
    return document.querySelector(".display-section .panel-content");
}

//global

const gameState = {
    //global
    funds: 200000,
    //personnel
    nextPersonnelId: 1,
    personnel: [],
    asignedPersonnel: [],
    isSelectingPersonnel: false,
    //Missions
    availableMissions: [],
    selectedMission: null
}

function updateFunds() {
    document.getElementById("funds").innerHTML = `$${gameState.funds}`;
}
updateFunds();

//personel
const PossibleName = ["KOVAC", "KOVALSKIY", "SKIPPER", "NIKOLA", "JAMES", "REMBO"];
const PossibleRole = ["ASSAULT", "MEDIC", "RECON", "HEAVY"];

function generatePersonnel() {
    const name = PossibleName[Math.floor(Math.random() * PossibleName.length)];
    const role = PossibleRole[Math.floor(Math.random() * PossibleRole.length)];
    const id = gameState.nextPersonnelId;

    gameState.nextPersonnelId++;

    return {id, name, role, status: "AVAILABLE", morale: 100, health: 100};
}

function hirePersonnel() {
    if (gameState.funds < 10000) {
        console.log("Not possible, funds too low");
    }
    else {
        const newPersonnel = generatePersonnel();

        gameState.funds -= 10000;
        gameState.personnel.push(newPersonnel);

        console.log("Hired new personnel: " + newPersonnel.id + ", " + newPersonnel.name + ", " + newPersonnel.role);
    }

    renderRoaster();
    updateFunds();
}

function renderRoaster() {
    const roaster = document.getElementById("roster-body");
    roaster.innerHTML = "";

    gameState.personnel.forEach(p => {
        const row = document.createElement("tr");
        row.className = "standart-row";
        row.dataset.index = p.id;

        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.role}</td>
            <td>${p.status}</td>
            <td>${p.morale}%</td>
            <td>${p.health}%</td>
        `;

     roaster.appendChild(row);
    })
}

function assignPersonnel(p) {
    if (gameState.isSelectingPersonnel) {
    const index = p.currentTarget.dataset.index;

    gameState.asignedPersonnel.push(index);
    index.className = "selected-row";
    console.log(gameState.asignedPersonnel);
    }
    return;
}

document.getElementById("hire-btn").addEventListener("click", hirePersonnel);

//missions

const PossibleType = ["RECON", "ASSAULT", "DEFENCE", "PATROL", "ACCOMPANIMENT"];
const PossibleReward = [5000, 10000, 15000, 20000, 25000, 30000];

function generateMission() {
    const type = PossibleType[Math.floor(Math.random() * PossibleType.length)];
    const reward = PossibleReward[Math.floor(Math.random() * PossibleReward.length)];

    return {type, reward};
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
        </div>
    `).join("")

    document.querySelectorAll(".mission-card").forEach(
        card => {
            card.addEventListener("click", selectMission);
        }
    );
}

function selectMission(e) {
    const index = e.currentTarget.dataset.index;
    gameState.selectedMission = gameState.availableMissions[index];

    if (gameState.personnel.length === 0) {
        const display = getDisplay();
        display.innerHTML = `
            <p>NO AVAILABLE PERSONNEL</p>
            <p>HIRE SOMEONE BEFORE TAKING THIS MISSION</p>
        `;
    } else {
        renderMissionAssigment();
    }

    gameState.isSelectingPersonnel = true;
}

function renderMissionAssigment() {
    const display = getDisplay();

    display.innerHTML = `
        <p>MISSION: ${gameState.selectedMission.type}</p>
        <p>REWARD: $${gameState.selectedMission.reward}</p>
        <select id="personnel-select">
            <option value="">Select operator</option>
            ${gameState.personnel.map(p => 
                `<option value="${p.id}">${p.name} (${p.role})</option>`
            ).join("")}
        </select>
        <br>
        <button id="start-btn">[ START ]</button>
        <button id="cancel-btn">[ CANCEL ]</button>
    `;

    document.getElementById("start-btn").addEventListener("click", () => {
        const select = document.getElementById("personnel-select");
        const personId = parseInt(select.value);

        if (isNaN(personId)) return;


        simulateMission(personId);
        gameState.isSelectingPersonnel = false;
        gameState.asignedPersonnel = [];
    });

    document.getElementById("cancel-btn").addEventListener("click", () => {
        gameState.isSelectingPersonnel = false;
        gameState.asignedPersonnel = [];
        renderMissionList()});
}

function simulateMission(personId) {
    const display = getDisplay();
    const succes = Math.random() < 0.7;
    if (!gameState.selectedMission) return;

    if (succes) {
        gameState.funds += gameState.selectedMission.reward;

        display.innerHTML = `
            <p>MISSION RESULT: SUCCESS</p>
            <p>REWARD RECEIVED: $${gameState.selectedMission.reward}</p>
        `;
    }
    else {
        gameState.personnel = gameState.personnel.filter(p => p.id !== personId);

        display.innerHTML = `
            <p>MISSION RESULT: FAILURE</p>
            <p>OPERATIVE LOST</p>
        `;
    }
    gameState.selectedMission = null;
    updateFunds();
    renderRoaster();
}


document.getElementById("mission-btn").addEventListener("click", openMissionBoard);