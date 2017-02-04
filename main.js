var control = require('control');
var choosePersonality = require('personality.chooser');
var bePersonal = require('personality');

//have a way to scale up unit bodies
//have a way to build the base programatically

module.exports.loop = function () {
    //add functionality to existing creeps (single loop update stuff)
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
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
        bePersonal(creep);
        _.each(control.roles, function(role) {
            if (creep.memory.role == role.name) {
                role.roleClass.run(creep);
            }
        });
    }

    //do actions for each room
    for(var roomId in Game.rooms) {
        //console.log(roomId);
        var room = Game.rooms[roomId];

        //order spawns in rooms as necessary
        _.each(control.roomSpawnTargets, function(spawnTarget) {
            var spawned = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == spawnTarget.role.name);
            
            if (spawned.length < spawnTarget.target()) {
                //console.log("room " + roomId + " has " + spawned.length + " " + spawnTarget.role.name + " of " + spawnTarget.target);
                var availableSpawns = _.filter(room.find(FIND_MY_SPAWNS), (spawn) => spawn.canCreateCreep(spawnTarget.role.body) == OK);

                if (availableSpawns.length > 0) {
                    availableSpawns[0].createCreep(spawnTarget.role.body, undefined, {role: spawnTarget.role.name, personality: choosePersonality()});
                    console.log("room " + roomId + " spawner " + availableSpawns[0].name + " spawning new " + spawnTarget.role.name);
                }
            }
        });

        //order builds in rooms as necessary

    }
}