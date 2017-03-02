var control = require('control');
var personality = require('personality');

var spawn = {
	roomSpawn : function (room) {
		for (var role in control.spawn.spawnPriorities) {
			role = control.spawn.spawnPriorities[role];
			var shouldSpawn = _.filter(control.spawn.roomSpawnTargets, (spawnTarget) => spawnTarget.role == role)[0].shouldSpawn(room);

		    if (shouldSpawn) {
		        var roleDefinition = _.filter(control.roles, (roleDef) => roleDef.name == role)[0];
		        var availableSpawns = _.filter(room.find(FIND_MY_SPAWNS), (spawn) => !spawn.spawning);

		        if (availableSpawns.length > 0) {
					//console.log("Trying to spawn " + roleDefinition.name);
		        	var spawnResult = availableSpawns[0].createCreep(roleDefinition.body(room.energyAvailable), undefined, {role: role, personality: personality.chooser()});
		            if (spawnResult != ERR_NOT_ENOUGH_ENERGY) {
			            console.log("spawner " + availableSpawns[0].name + " spawning new " + role + ": " + spawnResult);
						return;
			        }
		        }
		    }
		}
	}
};

 module.exports = spawn;