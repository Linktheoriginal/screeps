var control = require('control');
var personality = require('personality');

var spawn = {
	roomSpawn : function (room) {
		for (var role in control.spawn.spawnPriorities) {
			role = control.spawn.spawnPriorities[role];

			var spawned = _.filter(room.find(FIND_MY_CREEPS), (creep) => 
				creep.memory.role == role);

			var spawnTarget = _.filter(control.spawn.roomSpawnTargets, (spawnTarget) => 
				spawnTarget.role == role)[0];
		    
		    if (spawned.length < spawnTarget.target(room)) {
		        var role = _.filter(control.roles, (role) => 
		        	role.name == spawnTarget.role)[0];

		        var availableSpawns = _.filter(room.find(FIND_MY_SPAWNS), (spawn) => 
		        	!spawn.spawning);

		        if (availableSpawns.length > 0) {
		        	var spawnResult = availableSpawns[0].createCreep(
		        		role.body(room.energyAvailable), 
		            	undefined, 
		            	{role: 
		            		role.name, 
		            		personality: personality.chooser()
		            	});
		        	
		            if (spawnResult == OK) {
			            console.log("spawner " + availableSpawns[0].name + " spawning new " + role.name);
			        }
		        }
		    }
		}
	}
};

 module.exports = spawn;