var utils = require('utils');

function growBody(energyAvailable, bodyStart, bodyGrowth) {
    var bodyGrowthSize = Math.floor((energyAvailable - utils.bodyCost(bodyStart)) / utils.bodyCost(bodyGrowth));
    var bodyDefinition = bodyStart;
    for (i = 1; i < bodyGrowthSize; i++) {
        bodyDefinition = bodyDefinition.concat(bodyGrowth);
    }
    return bodyDefinition;
};

function balanced(energyAvailable) {
    return growBody(energyAvailable, [WORK, CARRY, MOVE], [WORK, CARRY, MOVE]);
};

function worker(energyAvailable) {
    return growBody(energyAvailable, [WORK, CARRY, MOVE], [WORK, CARRY]);
};

function transporter(energyAvailable) {
    return growBody(energyAvailable, [CARRY, CARRY, MOVE], [CARRY, CARRY, MOVE]);
};

var roles = [
    {
    	name: "harvester",
    	body: function(energyAvailable) {
            return worker(energyAvailable);
    	}
    },
    {
    	name: "upgrader",
    	body: function(energyAvailable) {
    		return worker(energyAvailable);
    	}
    },
    {
    	name: "builder",
    	body: function(energyAvailable) {
    		return worker(energyAvailable);
    	}
    },
    {
        name: "repairer",
        body: function(energyAvailable) {
            return worker(energyAvailable);
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