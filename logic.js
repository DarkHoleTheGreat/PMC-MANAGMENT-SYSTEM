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

//personnel

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
}

//Missions
const PossibleType = ["RECON", "ASSAULT", "DEFENCE", "PATROL", "ACCOMPANIMENT"];
const PossibleReward = [5000, 10000, 15000, 20000, 25000, 30000];

function generateMission() {
    const type = PossibleType[Math.floor(Math.random() * PossibleType.length)];
    const reward = PossibleReward[Math.floor(Math.random() * PossibleReward.length)];

    return {type, reward};
}

function simulateMission(personId) {
    const succes = Math.random() < 0.7;
    if (!gameState.selectedMission) return;

    if (succes) {
        gameState.funds += gameState.selectedMission.reward;
    }
    else {
        gameState.personnel = gameState.personnel.filter(p => p.id !== personId);
    }
    gameState.selectedMission = null;
}

