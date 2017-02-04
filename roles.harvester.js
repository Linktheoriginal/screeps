var harvestAction = require('actions.harvest');

var harvesterRole = {

    name: "harvester",
    body: [CARRY,WORK,MOVE],
    run: function(creep) {

        if (creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
            creep.say("harvesting");
        }
	    if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
            creep.say("delivering");
        }

        if (creep.memory.delivering) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        } else {
            harvestAction(creep);
        }
	}
};

module.exports = harvesterRole;