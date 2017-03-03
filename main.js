var control = require('control');
var creepLogic = require('logic.creep');
var towerLogic = require('logic.tower');
var spawn = require('spawn');
var planner = require('planner');

function creepByName(name) {
    console.log("test");
}

module.exports.loop = function () {
    //add functionality to existing creeps (update memory)
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        //delete creep.memory.target;
        //creep.memory.personality = choosePersonality();
    }

    //cleanup
    for (var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    //run creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepLogic.run(creep);
    }

    //run towers
    for (var name in Game.structures) {
        if (Game.structures[name].structureType == STRUCTURE_TOWER) {
            towerLogic.run(Game.structures[name]);
        }
    }

    //do actions for each room
    for(var roomId in Game.rooms) {

        spawn.roomSpawn(Game.rooms[roomId]);

        //order builds in rooms as necessary
        if (Game.time % 10 == 0) {
            planner.roadPlanner.planRoads(Game.rooms[roomId]);
            planner.extensionPlanner.planExtensions(Game.rooms[roomId]);
        }

    }
}