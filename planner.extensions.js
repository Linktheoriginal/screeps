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

function checkerBoard(room, pos) {
    var depth = 0;
    var pattern = [
        {x: -1, y: -1}, 
        {x: -1, y: 1},
        {x: 1, y: -1},
        {x: 1, y: 1}
    ];
    var locations = [{
        x: pos.x,
        y: pos.y
    }];

    while (depth < 10) {
        var newLocations = [];
        for (var location in locations) {
            location = locations[location];
             if (utils.open(room, location.x, location.y)) {
                return location;
            } else {
                for (var patternStep in pattern) {
                    patternStep = pattern[patternStep];
                    newLocations.push({
                        x: location.x + patternStep.x,
                        y: location.y + patternStep.y
                    });
                }
            }
        }
        locations = newLocations;
        depth = depth + 1;
    }
};

module.exports = extensionPlanner;