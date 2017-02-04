var harvestAction = require('actions.harvest');
var buildAction = require('actions.build');

var builderRole = {

	name: "builder",
	body: [WORK,MOVE,CARRY],
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	    	buildAction(creep);
	    } else {
	        harvestAction(creep);
	    }
	}
};

module.exports = builderRole;