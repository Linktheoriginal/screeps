var utils = require('utils');

var towerLevels = [0, 0, 0, 1, 1, 2, 2, 3, 6];

var towerPlanner = {
    planTowers(room) {
        var towerLimit = towerLevels[room.controller.level];
        var builtTowers = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType == STRUCTURE_TOWER;
            }
        });
        var towerConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: function(site) {
                return site.structureType == STRUCTURE_TOWER;
            }
        });
        towers = builtTowers.concat(towerConstructionSites);

        if (towers.length < towerLimit) {
            var center = new RoomPosition(25, 25, room.name);
            for (var i = towers.length; i <= towerLimit; i++) {
                var newTowerLocation = utils.nearestOpen(room, center);
                room.createConstructionSite(newTowerLocation.x, newTowerLocation.y, STRUCTURE_TOWER);
            }
        }
    }
}

module.exports = towerPlanner;