var utils = require('utils');

var spawnControls = {
    roomLimit: 10,
    currentCreepCount: function(room) {
        return room.find(FIND_MY_CREEPS).length();
    },
    roomSpawnTargets: [
        {
            role: 'harvester',
            shouldSpawn: function(room) {
                var harvesters = utils.creepsByRole(room, "harvester");

                var availableHarvestPositions = 0;
                var sources = room.find(FIND_SOURCES)
                for (var source in sources) {
                    source = sources[source];
                    availableHarvestPositions += utils.valueCountIn2DArray(utils.adjacent(room, source.pos, 1, "open"), true);
                }

                if (harvesters.length >= utils.creepsByRole(room, "transporter").length || availableHarvestPositions <= harvesters.length) {
                    return false;
                } else {
                    var numWorkParts = utils.sumBodyParts(harvesters, WORK);
                    return numWorkParts < room.find(FIND_SOURCES).length * 5;
                }
            }
        },
        {
            role: 'builder', 
            shouldSpawn: function(room) {
                var buildTargets = room.find(FIND_MY_CONSTRUCTION_SITES);
                var totalEffort = 0;
                for (var target in buildTargets) {
                    target = buildTargets[target];
                    totalEffort += target.progressTotal - target.progress;
                }

                return totalEffort > (utils.creepRoleCount(room, "builder") * 3000);
            }
        },
        {
            role: 'repairer',
            shouldSpawn: function(room) {
                var repairTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax;
                    }
                });

                var repairTotal = 0;
                for (var target in repairTargets) {
                    target = repairTargets[target];
                    repairTotal += target.hitsMax - target.hits;
                }

                return repairTotal > (utils.creepRoleCount(room, "repairer") * 3000);
            }
        },
        {
            role: 'transporter',
            shouldSpawn: function(room) {
                return utils.creepRoleCount(room, "transporter") < utils.creepRoleCount(room, "harvester");
            }
        },
        {
            role: 'upgrader',
            shouldSpawn: function(room) {
                return utils.creepRoleCount(room, "upgrader") < 1;
            }
        }
    ],
    spawnPriorities: [
        "harvester",
        "transporter",
        "upgrader",
        "builder",
        "repairer"
    ]
};

module.exports = spawnControls;