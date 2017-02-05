var control = require('control');
var creepLogic = require('creep.run');
var spawn = require('spawn');

//have a way to scale up unit bodies
//have a way to build the base programatically

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

    //do actions for each room
    for(var roomId in Game.rooms) {

        spawn.roomSpawn(Game.rooms[roomId]);

        //order builds in rooms as necessary

    }
}