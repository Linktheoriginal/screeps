var utils = require('utils');
var control = require('control');

var towerLogic = {
	run: function(tower) {
        var repairTargets = [];
        if (control.towerRepair) {
            repairTargets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART
            });
        } else if (control.towerEmergencyRepair) {
            repairTargets = tower.room.find(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.hits < structure.hitsMax / 10 && structure.hits < 100000
                        && (structure.structureType == STRUCTURE_RAMPART 
                        || structure.structureType == STRUCTURE_SPAWN 
                        || structure.structureType == STRUCTURE_CONTAINER);
                }
            });
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        if (repairTargets.length > 0) {
            tower.repair(repairTargets[utils.randomInt(repairTargets.length)]);
        }
	}
};

module.exports = towerLogic;