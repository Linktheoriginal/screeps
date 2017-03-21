var roadPlanner = {
    planRoads(room) {
        var roadPoints;

        var roomSpawns = room.find(FIND_MY_SPAWNS);
        for (var spawn in roomSpawns) {
            spawn = roomSpawns[spawn];

            //sources to spawns
            var sources = room.find(FIND_SOURCES);
            for (var source in sources) {
                source = sources[source];
                roadPoints = room.findPath(spawn.pos, source.pos, {
                    ignoreCreeps: true,
                    ignoreRoads: true
                });
                for (var location in roadPoints) {
                    location = roadPoints[location];
                    room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);
                }
            }
            
            //spawn pavilion
            for (var x = spawn.pos.x - 1; x <= spawn.pos.x + 1; x++) {
                room.createConstructionSite(x, spawn.pos.y + 1, STRUCTURE_ROAD);
                room.createConstructionSite(x, spawn.pos.y - 1, STRUCTURE_ROAD);
            }
            for (var y = spawn.pos.y - 1; y <= spawn.pos.y + 1; y++) {
                room.createConstructionSite(spawn.pos.x + 1, y, STRUCTURE_ROAD);
                room.createConstructionSite(spawn.pos.x - 1, y, STRUCTURE_ROAD);
            }
            
            //source pavilion
            for(var source in sources) {
                source = sources[source];
                for (var x = source.pos.x - 2; x <= source.pos.x + 2; x++) {
                    room.createConstructionSite(x, source.pos.y + 2, STRUCTURE_ROAD);
                    room.createConstructionSite(x, source.pos.y - 2, STRUCTURE_ROAD);
                }

                for (var y = source.pos.y - 2; y <= source.pos.y + 2; y++) {
                    room.createConstructionSite(source.pos.x + 2, y, STRUCTURE_ROAD);
                    room.createConstructionSite(source.pos.x - 2, y, STRUCTURE_ROAD);
                }
            }
            
            //sources to controller
            for (var source in sources) {
                source = sources[source];
                    roadPoints = room.findPath(source.pos, room.controller.pos, {
                    ignoreCreeps: true,
                    ignoreRoads: true
                });
                for (var location in roadPoints) {
                    location = roadPoints[location];
                    room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);
                }
            }

            //controller to spawns
            roadPoints = room.findPath(spawn.pos, room.controller.pos, {
                ignoreCreeps: true,
                ignoreRoads: true
            });
            for (var location in roadPoints) {
                location = roadPoints[location];
                room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);
            }

            //spawns to ramparts
            var ramparts = room.find(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType == STRUCTURE_RAMPART;
               }
            });
            for (var rampart in ramparts) {
                rampart = ramparts[rampart];
                roadPoints = room.findPath(rampart.pos, spawn.pos, {
                    ignoreCreeps: true,
                    ignoreRoads: true
                });
                for (var location in roadPoints) {
                    location = roadPoints[location];
                    room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);
                }
            }
        }
    }
};

module.exports = roadPlanner;