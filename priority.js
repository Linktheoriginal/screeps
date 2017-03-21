var utils = require('utils');
var control = require('control');

var buildPriorities = [
	{type: STRUCTURE_EXTENSION},
	{type: STRUCTURE_TOWER},
	{type: STRUCTURE_ROAD},
	{type: STRUCTURE_WALL},
	{type: STRUCTURE_RAMPART}
];

var priorities = {
	energySink: function (creep) {
		if (control.logCPU) {
			console.log("Before energySink Priority: " + Game.cpu.getUsed());
		}

        //towers
		var towerTargets = [];
		towerTargets = creep.room.find(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER);
			}
		});
		towerTargets = utils.halfEnergyStructures(towerTargets);

		//spawners
		var spawnTargets = [];
		if (creep.room.energyAvailable < creep.room.energyCapacityAvailable / 2) {
			spawnTargets = creep.room.find(FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION);
				}
			});
			spawnTargets = utils.halfEnergyStructures(spawnTargets);
		}

		//builders
		var builderTargets = utils.creepsByRole(creep.room, "builder");
		if (utils.totalCreepEnergy(builderTargets) > utils.totalCreepEnergyCapacity(builderTargets) / 2) {
			builderTargets = [];
		} else {
			builderTargets = utils.sortCreepsByEnergy(utils.halfEnergyCreeps(builderTargets));
		}

		//upgraders
		var upgraderTargets = utils.creepsByRole(creep.room, "upgrader");
		if (utils.totalCreepEnergy(upgraderTargets) > utils.totalCreepEnergyCapacity(upgraderTargets) / 2) {
			upgraderTargets = [];
		} else {
			upgraderTargets = utils.sortCreepsByEnergy(utils.halfEnergyCreeps(upgraderTargets));
		}

		//repairers
		var repairerTargets = utils.creepsByRole(creep.room, "repairer");
		if (utils.totalCreepEnergy(repairerTargets) > utils.totalCreepEnergyCapacity(repairerTargets) / 2) {
			repairerTargets = [];
		} else {
			repairerTargets = utils.sortCreepsByEnergy(utils.halfEnergyCreeps(repairerTargets));
		}

		//wallbuilders
		var wallbuilderTargets = utils.creepsByRole(creep.room, "wallbuilder");
		if (utils.totalCreepEnergy(wallbuilderTargets) > utils.totalCreepEnergyCapacity(wallbuilderTargets) / 2) {
			wallbuilderTargets = [];
		} else {
			wallbuilderTargets = utils.sortCreepsByEnergy(utils.halfEnergyCreeps(wallbuilderTargets));
		}

		//containers
		var containerTargets = creep.room.find(FIND_MY_STRUCTURES, {
			filter: function(structure) {
				return structure.structureType == STRUCTURE_CONTAINER
					&& structure.storeCapacity > structure.store(RESOURCE_ENERGY);
			}
		});

		var allTargets = 
			towerTargets.concat(
			spawnTargets.concat(
			upgraderTargets.concat(
			builderTargets.concat(
			repairerTargets.concat(
			wallbuilderTargets.concat(
			containerTargets))))));
			
		var untargetedTargets = _.filter(allTargets, function (target) {
		    return utils.creepsByTarget(creep.room, target.id).length < 1;
		});
		
		var priorityTargets = [];
		if (untargetedTargets.length > 0) {
		    priorityTargets = untargetedTargets.slice(0, Math.ceil(allTargets.length / 4));
		} else {
		    priorityTargets = allTargets.slice(0, Math.ceil(allTargets.length / 4));
		}
		
		if (control.logCPU) {
			console.log("After energySink Priority: " + Game.cpu.getUsed());
		}

		//console.log(utils.listTargetNames(allTargets));
		//console.log(utils.listTargetNames(priorityTargets));
		return priorityTargets[utils.randomInt(priorityTargets.length)];
	},

	build: function(creep) {
		if (control.logCPU) {
			console.log("Before build Priority: " + Game.cpu.getUsed());
		}

        //filter needed for a corner case where a creep is standing on the construction site.
        //todo - update the filter to use creep.room.lookAt
		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
		    filter: function(site) {
		        return !(creep.pos.x == site.pos.x && creep.pos.y == site.pos.y);
		    }
		});
		if (targets.length > 0) {
			if (control.logCPU) {
				console.log("After build Priority: " + Game.cpu.getUsed());
			}
			return creep.pos.findClosestByRange(targets);
			/*
			targets.sort(function (a, b) {
				return(buildPriorities.findIndex(item => item.type == a.structureType) - buildPriorities.findIndex(item => item.type == b.structureType))
			});
			return targets[0];
			*/
		}
	},

    repair: function(creep) {
		if (control.logCPU) {
			console.log("Before repair Priority: " + Game.cpu.getUsed());
		}
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });

		var nearbyTargets = _.filter(targets, target => {
			return (creep.pos.getRangeTo(target) <= 2 && utils.getEnergy(target) < utils.getEnergyCapacity(target) / 2);
		});

		var returnTarget;

		if (nearbyTargets.length > 0) {
			returnTarget == nearbyTargets[utils.randomInt(nearbyTargets.length)];
		} else if (targets.length > 0) {
			targets.sort(function (a, b) {
				return((b.hits/b.hitsMax) - (a.hits/a.hitsMax));
			});

			returnTarget = targets[utils.randomInt(Math.floor(targets.length / 4))];
		}
		if (control.logCPU) {
			console.log("After repair Priority: " + Game.cpu.getUsed());
		}
		return returnTarget;
    },

	wall: function(creep) {
		if (control.logCPU) {
			console.log("Before wall Priority: " + Game.cpu.getUsed());
		}
		var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < (structure.hitsMax / 600) && (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART);
            }
        });

		if (control.logCPU) {
			console.log("After wall Priority: " + Game.cpu.getUsed());
		}
		return targets[utils.randomInt(targets.length)];
	},

	energySource: function(creep) {
		if (control.logCPU) {
			console.log("Before energySource Priority: " + Game.cpu.getUsed());
		}
		var resources = creep.room.find(FIND_DROPPED_ENERGY);

		var containers = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER
					&& structure.store[RESOURCE_ENERGY] > 0);
			}
		});

		var energySources = resources.concat(containers);
		var returnTarget;
		returnTarget = energySources.sort(function (a, b) {
			return utils.creepsByTarget(creep.room, a.id).length
			 - utils.creepsByTarget(creep.room, b.id).length;
		})[0];
		if (control.logCPU) {
			console.log("After energySource Priority: " + Game.cpu.getUsed());
		}
		return returnTarget;
	},

	harvest: function(creep) {
		if (control.logCPU) {
			console.log("Before harvest Priority: " + Game.cpu.getUsed());
		}

		var harvestTargets = creep.room.find(FIND_SOURCES, {
			filter: function(source) {
				return utils.valueCountIn2DArray(utils.adjacent(creep.room, source.pos, 1, "walkable"), true) - utils.creepsByTarget(creep.room, source.id).length > 0;
			}
		});

		harvestTargets = harvestTargets.sort(function (a, b) {
			return utils.sumBodyParts(utils.creepsByTarget(creep.room, a.id), WORK) - utils.sumBodyParts(utils.creepsByTarget(creep.room, b.id), WORK);
		});

        console.log(harvestTargets[0].id);

		if (control.logCPU) {
			console.log("After harvest Priority: " + Game.cpu.getUsed());
		}

		return harvestTargets[0];
	},

	remoteHarvest: function(creep) {
		var nearbyRooms = utils.nextdoorRooms(creep.room.name);
	},

	remoteTransport: function(creep) {
		var nearbyRooms = utils.nextdoorRooms(creep.room.name);
	},

	heal: function(creep) {
		var healTargets = creep.room.find(FIND_MY_CREEPS, {
			filter: function(target) {
				return target.hits < target.hitsMax;
			}
		});

		healTargets.sort(function (a, b) {
			return a.hits / a.hitsMax - b.hits / b.hitsMax;
		})[utils.randomInt(healTargets.length / 4)];
	},

	melee: function(creep) {
		//expensive! limit this?
		var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (!enemy) {
			enemy = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
				filter: function(structure) {
					return structure.structureType != STRUCTURE_CONTROLLER;
				}
			});
		}
		return enemy;
	},

	ranged: function(creep) {
		var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (!enemy) {
			enemy = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
				filter: function(structure) {
					return structure.structureType != STRUCTURE_CONTROLLER;
				}
			});
		}
		return enemy;
	},

	colonize: function(creep) {
		//update to do nearest first?
		for (var room in Game.rooms) {
			room = Game.rooms[room];
			if (room.controller.username == "") {
				return room.controller;
			}
		}
	},

	attackRoom: function(creep) {
		for (var room in Game.rooms) {
			room = Game.rooms[room];
			var hostileSpawns = room.find(FIND_HOSTILE_STRUCTURES, {
				filter: function(structure) {
					return structure.structureType == STRUCTURE_SPAWN;
				}
			});
			if (hostileSpawns.length > 0) {
				return room;
			}
		}
	}
}

module.exports = priorities;