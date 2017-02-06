var control = require('control');
var personality = require('personality');

var spawn = {
	roomSpawn : function (room) {
		_.each(control.roomSpawnTargets, function(spawnTarget) {
		    var spawned = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == spawnTarget.role);

		    if (spawned.length < spawnTarget.target(room)) {
		        var role = _.filter(control.roles, (role) => role.name == spawnTarget.role)[0];
		        var availableSpawns = _.filter(room.find(FIND_MY_SPAWNS), (spawn) => !spawn.spawning);

		        if (availableSpawns.length > 0) {
		            if (availableSpawns[0].createCreep(role.body(room.energyAvailable), undefined, {role: role.name, personality: personality.chooser()}) == OK) {
			            console.log("spawner " + availableSpawns[0].name + " spawning new " + role.name);
			        }
		        }
		    }
		});
	}
};

 module.exports = spawn;