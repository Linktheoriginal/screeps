var utils = require('utils');
var warParty = require('control.warparty');
var personality = require('personality');
var roles = require('control.roles');

var spawnControls = {
    roomLimit: 10,

    currentCreepCount: function(room) {
        return room.find(FIND_MY_CREEPS).length();
    },

    roomSpawn : function (room) {
		for (var role in this.spawnPriorities) {
			role = this.spawnPriorities[role];
			var shouldSpawn = _.filter(this.roomSpawnTargets, (spawnTarget) => spawnTarget.role == role)[0].shouldSpawn(room);

		    if (shouldSpawn) {
		        var roleDefinition = _.filter(roles, (roleDef) => roleDef.name == role)[0];
		        var availableSpawns = _.filter(room.find(FIND_MY_SPAWNS), (spawn) => !spawn.spawning);

		        if (availableSpawns.length > 0) {
					//console.log("Trying to spawn " + roleDefinition.name);
		        	var spawnResult = availableSpawns[0].createCreep(roleDefinition.body(room), undefined, {role: role, personality: personality.chooser()});
		            if (spawnResult != ERR_NOT_ENOUGH_ENERGY) {
			            console.log("A new " + role + " named " + spawnResult + " has joined us at " + availableSpawns[0].name + " in province " + room.name);
			        }
		        }
		        return;
		    }
		}
	},

    roomSpawnTargets: [
        {
            role: 'harvester',
            shouldSpawn: function(room) {
                var harvesters = utils.creepsByRole(room, "harvester");

                var availableHarvestPositions = 0;
                var sources = room.find(FIND_SOURCES);
                for (var source in sources) {
                    source = sources[source];
                    availableHarvestPositions += utils.valueCountIn2DArray(utils.adjacent(room, source.pos, 1, "walkable"), true);
                }

                if (harvesters.length > utils.creepsByRole(room, "transporter").length || harvesters.length >= availableHarvestPositions) {
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

                return totalEffort > (utils.creepRoleCount(room, "builder") * 7000);
            }
        },
        {
            role: 'repairer',
            shouldSpawn: function(room) {
                var repairTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART;
                    }
                });

                var repairTotal = 0;
                for (var target in repairTargets) {
                    target = repairTargets[target];
                    repairTotal += target.hitsMax - target.hits;
                }

                return repairTotal > (utils.creepRoleCount(room, "repairer") * 7000) && utils.creepRoleCount(room, "repairer") < 5;
            }
        },
        {
            role: 'wallbuilder',
            shouldSpawn: function(room) {
                var wallTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < (structure.hitsMax / 600) && (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART);
                    }
                });
                return(Math.min(3, wallTargets.length) > utils.creepRoleCount(room, "wallbuilder"));
            }
        },
        {
            role: 'scout',
            shouldSpawn: function(room) {
                return room.controller.level > 2 && utils.creepRoleCount(room, "scout") < 2;
            }
        },
        {
            role: 'transporter',
            shouldSpawn: function(room) {
                var harvesters = utils.creepsByRole(room, "harvester");
                var transporters = utils.creepsByRole(room, "transporter");
                return utils.sumBodyParts(transporters, CARRY) < utils.sumBodyParts(harvesters, WORK) * 3.5;
            }
        },
        {
            role: 'upgrader',
            shouldSpawn: function(room) {
                if (room.controller.level == 8) {
                    return utils.creepRoleCount(room, "upgrader") < 2;
                }
                var upgraders = utils.creepsByRole(room, "upgrader");
                //return upgraders <= room.controller.level;
                return utils.sumBodyParts(upgraders, WORK) <= room.controller.level * 1.5;
            }
        },
        {
            role: 'healer',
            shouldSpawn: function(room) {
                if (room.controller.level < warParty.minimumControllerLevel) {
                    return false;
                } else {
                    return utils.creepRoleCount(room, "healer") < _.filter(warParty.defineParty(room), role => role == "healer").length;
                }
            }
        },
        {
            role: 'fighter',
            shouldSpawn: function(room) {
                if (room.controller.level < warParty.minimumControllerLevel) {
                    return false;
                } else {
                    return utils.creepRoleCount(room, "fighter") < _.filter(warParty.defineParty(room), role => role == "fighter").length;
                }
            }
        },
        {
            role: 'archer',
            shouldSpawn: function(room) {
                if (room.controller.level < warParty.minimumControllerLevel) {
                    return false;
                } else {
                    return utils.creepRoleCount(room, "archer") < _.filter(warParty.defineParty(room), role => role == "archer").length;
                }
            }
        },
        {
            role: 'tank',
            shouldSpawn: function(room) {
                if (room.controller.level < warParty.minimumControllerLevel) {
                    return false;
                } else {
                    return utils.creepRoleCount(room, "tank") < _.filter(warParty.defineParty(room), role => role == "tank").length;
                }
            }
        },
        {
            role: 'colonist',
            shouldSpawn: function(room) {
                //if gcl > number of controlled rooms + global existing colonists
                return false;
            }
        }
    ],
    spawnPriorities: [
        "harvester",
        "transporter",
        "upgrader",
        "builder",
        "repairer",
        "tank",
        "wallbuilder",
        "scout",
        "fighter",
        "healer",
        "archer"
        //"colonist"
    ]
};

module.exports = spawnControls;