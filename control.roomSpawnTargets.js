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
            return Math.ceil(structures.length / 2);
    	}
    },
    {
    	role: 'builder', 
    	target: function(room) {
    		return room.find(FIND_MY_CONSTRUCTION_SITES).length;
    	}
    },
    {
    	role: 'upgrader', 
    	target: function(room) {
    		return 6;
    	}
    }
];

module.exports = roomSpawnTargets;