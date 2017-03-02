var utils = require('utils');

var extensionLevels = [0, 0, 5, 10, 20, 30, 40, 50, 60];

var extensionPlanner = {
    planExtensions(room) {
        var extensionLimit = extensionLevels[room.controller.level];
        var builtExtensions = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        });
        var extensionConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: function(site) {
                return site.structureType == STRUCTURE_EXTENSION;
            }
        });
        extensions = builtExtensions.concat(extensionConstructionSites);

        if (extensions.length < extensionLimit) {
            var spawn = room.find(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
            })[0];
            if (spawn) {
                for (var i = extensions.length; i <= extensionLimit; i++) {
                    var newExtensionLocation = checkerBoard(room, spawn.pos);
                    room.createConstructionSite(newExtensionLocation.x, newExtensionLocation.y, STRUCTURE_EXTENSION);
                }
            }
        }
    }
};

//fix this to be breadth-first later
function checkerBoard(room, pos) {
    var pattern = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (var location in pattern) {
        location = pattern[location];
        if (utils.open(room, pos.x + location[0], pos.y + location[1])) {
            var foundPos = pos;
            foundPos.x += location[0];
            foundPos.y += location[1];
            return foundPos;
        };
    }
    for (var location in pattern) {
        location = pattern[location];
        var newPos = pos;
        newPos.x += location[0];
        newPos.y += location[1];
        return checkerBoard(room, newPos);
    }
};

module.exports = extensionPlanner;