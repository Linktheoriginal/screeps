var bodyCosts = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
}

function balancedWorker(energyAvailable) {
    var bodyDefinition = [WORK, MOVE, CARRY];
    var sizedBodyDefinition = bodyDefinition;
    var bodySize = Math.floor(energyAvailable / (bodyCosts.move + bodyCosts.work + bodyCosts.carry));
    for (i = 1; i < bodySize; i++) {
        sizedBodyDefinition = sizedBodyDefinition.concat(bodyDefinition);
    }
    return sizedBodyDefinition;
}

function heavyWorker(energyAvailable) {
    var bodyStartDefinition = [WORK, WORK, CARRY, CARRY, MOVE];
    var bodyStartDefinitionSize = bodyCosts.move + (2 * bodyCosts.work) + (2 * bodyCosts.carry);

    var bodyGrowthDefinition = [WORK, CARRY];
    var bodyGrowthDefinitionSize = bodyCosts.work + bodyCosts.carry;

    var bodyGrowSize = Math.floor((energyAvailable - bodyStartDefinitionSize) / bodyGrowthDefinitionSize);

    var bodyDefinition = bodyStartDefinition;
    for (i = 0; i < bodyGrowSize; i++) {
        bodyDefinition = bodyDefinition.concat(bodyGrowthDefinition);
    }
    return bodyDefinition;
}

function transporter(energyAvailable) {
    var bodyDefinition = [CARRY, CARRY, MOVE];
    var bodyDefinitionSize = (bodyCosts.carry * 2) + (bodyCosts.move * 1);
    var bodyGrowSize = Math.floor(energyAvailable / bodyDefinitionSize);
    var body = bodyDefinition;
    for (i = 1; i < bodyGrowSize; i++) {
        body = body.concat(bodyDefinition);
    }
    return bodyDefinition;
}

var roles = [
    {
    	name: "harvester",
    	body: function(energyAvailable) {
            return balancedWorker(energyAvailable);
    	}
    },
    {
    	name: "upgrader",
    	body: function(energyAvailable) {
    		return balancedWorker(energyAvailable);
    	}
    },
    {
    	name: "builder",
    	body: function(energyAvailable) {
    		return balancedWorker(energyAvailable);
    	}
    },
    {
        name: "repairer",
        body: function(energyAvailable) {
            return balancedWorker(energyAvailable);
        }
    },
    {
        name: "heavyHarvester",
        body: function(energyAvailable) {
            return heavyWorker(energyAvailable);
        }
    },
    {
        name: "heavyUpgrader",
        body: function(energyAvailable) {
            return heavyWorker(energyAvailable);
        }
    },
    {
        name: "transporter",
        body: function(energyAvailable) {
            return transporter(energyAvailable);
        }
    }
];

module.exports = roles;