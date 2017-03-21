var control = require('control');
var creepLogic = require('logic.creep');
var towerLogic = require('logic.tower');
var spawn = require('control.spawn');
var planner = require('planner');

module.exports.loop = function () {
    if (control.logCPU) {
        console.log("Start: " + Game.cpu.getUsed());
    }
    //add functionality to existing creeps (update memory)
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        //delete creep.memory.target;
        //creep.memory.personality = choosePersonality();
    }

    if (control.logCPU) {
        console.log("After Update: " + Game.cpu.getUsed());
    }

    //cleanup
    for (var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    if (control.logCPU) {
        console.log("After Cleanup: " + Game.cpu.getUsed());
    }

    //run creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepLogic.run(creep);
    }

    if (control.logCPU) {
        console.log("After Creeps: " + Game.cpu.getUsed());
    }

    //run towers
    for (var name in Game.structures) {
        if (Game.structures[name].structureType == STRUCTURE_TOWER) {
            towerLogic.run(Game.structures[name]);
        }
    }

    if (control.logCPU) {
        console.log("After Towers: " + Game.cpu.getUsed());
    }

    //order spawns and builds in rooms as necessary
    for(var roomId in Game.rooms) {
        var room = Game.rooms[roomId];
        if (room.controller && room.controller.my) {
            //safemode
            checkActivateSafeMode(room);
            
            spawn.roomSpawn(Game.rooms[roomId]);

            if (Game.time % 100 == 0) {
                //cpu limiter

                planner.spawnPlanner.planSpawns(room);
                planner.roadPlanner.planRoads(room);
                planner.extensionPlanner.planExtensions(room);
                if (room.controller.level > 2) {
                    planner.wallPlanner.planWalls(room);
                    planner.towerPlanner.planTowers(room);
                    planner.containerPlanner.planContainers(room);
                }
            }
        }
    }

    if (control.logCPU) {
        console.log("After Rooms: " + Game.cpu.getUsed());
    }

    //plan war actions
    if (Game.time % 10 == 0) {
        
    }

    if (control.logCPU) {
        console.log("After War: " + Game.cpu.getUsed());
    }
}

function checkActivateSafeMode(room) {
    var hostileAttackCreeps = room.find(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
            return _.filter(creep.body, bodypart => bodypart.type == ATTACK).length > 0 || _.filter(creep.body, bodypart => bodypart.type == RANGED_ATTACK).length > 0;
        }
    });
    
    var poweredTowers = room.find(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType == STRUCTURE_TOWER && structure.energy > 0;
        }
    });

    var spawnIsDamaged = room.find(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType == STRUCTURE_SPAWN && structure.hits < structure.hitsMax;
        }
    }).length > 0;
    
    if (hostileAttackCreeps.length > 0 && (poweredTowers.length == 0 || spawnIsDamaged)) {
        if (!room.controller.safeModeCooldown && room.controller.safeModeAvailable) {
            room.controller.activateSafeMode();
        }
    }
}