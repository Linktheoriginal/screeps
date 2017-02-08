var utilities = require('utilities');
var control = require('control');
var prioritiesList = control.priorities;

var priorities = {
	energy: function (creep) {
		var energyPriorities = prioritiesList.energyPriorities;

		var targets = creep.room.find(FIND_MY_STRUCTURES, {
		        filter: (structure) => {
		        	var type = structure.structureType;
		            return (structure.energy < structure.energyCapacity && energyPriorities.findIndex(item => item.type == type) + 1);
		        }
			});

		if (control.priorityStrategy == "closest") {
			return creep.pos.findClosestByRange(targets);
		} else {
			if (targets.length > 0) {
				targets.sort(function(a, b) {
					return (energyPriorities.findIndex(item => item.type == a.structureType) - energyPriorities.findIndex(item => item.type == b.structureType));
				});

				var energyPriorityEntry = energyPriorities[energyPriorities.findIndex(item => item.type == targets[0].structureType)];
				var topPriorityRandomizer = energyPriorityEntry.top == 0 ? targets.length : energyPriorityEntry.top;
				topPriorityRandomizer = Math.min(topPriorityRandomizer, targets.length);
				return targets.slice(0, topPriorityRandomizer)[utilities.randomInt(topPriorityRandomizer)];
			}
		}
	},

	build: function(creep) {
		var buildPriorities = prioritiesList.buildPriorities;

		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
		if (targets.length > 0) {
			if (control.priorityStrategy == "closest") {
				return creep.pos.findClosestByRange(targets);
			} else {
				targets.sort(function (a, b) {
					return(buildPriorities.findIndex(item => item.type == a.structureType) - buildPriorities.findIndex(item => item.type == b.structureType))
				});

				return targets[0];
			}
		}
	},

    repair: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        
        if (control.priorityStrategy == "closest") {
			return creep.pos.findClosestByRange(targets);
		} else {
	        if (targets.length > 0) {
				targets.sort(function (a, b) {
					return((b.hits/b.hitsMax) - (a.hits/a.hitsMax));
				});

				return targets[0];
			}
		}
    },

	energySource: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		return sources[utilities.randomInt(sources.length)];
	}
}

module.exports = priorities;