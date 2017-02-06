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
    }
];

module.exports = roles;