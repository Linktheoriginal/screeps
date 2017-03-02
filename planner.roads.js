var roadPlanner = {
    planRoads(room) {
        var roadPoints;

        var roomSpawns = room.find(FIND_MY_SPAWNS);
        for (var spawn in roomSpawns) {
            spawn = roomSpawns[spawn];

            //sources to spawn
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

            //controller to spawn
            roadPoints = room.findPath(spawn.pos, room.controller.pos, {
                ignoreCreeps: true,
                ignoreRoads: true
            });
            for (var location in roadPoints) {
                location = roadPoints[location];
                room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);
            }
        }
    }
};

module.exports = roadPlanner;