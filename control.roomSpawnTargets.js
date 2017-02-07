var roomSpawnTargets = [
    {
    	role: 'harvester',
    	target: function(room) {
            var structures = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => { 
                    return(structure.structureType == STRUCTURE_SPAWN ||
                           structure.structureType == STRUCTURE_EXTENSION ||
                           structure.structureType == STRUCTURE_TOWER) &&
                           structure.energy < structure.energyCapacity;
                }
            });
            if (structures.length == 1) {
                return 1;
            } else {
                return Math.ceil(structures.length / 2);
            }
    	}
    },
    {
    	role: 'builder', 
    	target: function(room) {
    	    var buildTargets = room.find(FIND_MY_CONSTRUCTION_SITES).length;
    	    if (buildTargets == 1) {
    	        return 1;
    	    } else {
        		return Math.floor(buildTargets / 2);
    	    }
    	}
    },
    {
    	role: 'upgrader', 
    	target: function(room) {
    		return 6;
    	}
    },
    {
        role: 'repairer',
        target: function(room) {
            return 2;
        }
    }
];

module.exports = roomSpawnTargets;