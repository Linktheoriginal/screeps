var utils = require('utils');

var spawnPlanner = {
    planSpawns: function(room) {
        if (room.controller 
            && room.controller.my 
            && room.find(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
            }).length == 0) {
            
            //will do for now - would rather determine a better location than the center.
            var center = new RoomPosition(25, 25, room.name);
            var newSpawnLocation = utils.nearestOpen(room, center);
            room.createConstructionSite(newSpawnLocation.x, newSpawnLocation.y, STRUCTURE_TOWER);
        }
    }
};

module.exports = spawnPlanner;