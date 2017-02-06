var utilities = require('utilities');
var prioritiesList = require('control.priority');

var priorities = {
	energy: function (creep) {
		var energyPriorities = prioritiesList.energyPriorities;

		var targets = creep.room.find(FIND_MY_STRUCTURES, {
	        filter: (structure) => {
	        	var type = structure.structureType;
	            return (structure.energy < structure.energyCapacity && energyPriorities.findIndex(item => item.type == type) + 1);
	        }
		});

		if (targets.length > 0) {
			targets.sort(function(a, b) {
				return (energyPriorities.findIndex(item => item.type == a.structureType) - energyPriorities.findIndex(item => item.type == b.structureType));
			});

			var energyPriorityEntry = energyPriorities[energyPriorities.findIndex(item => item.type == targets[0].structureType)];
			var topPriorityRandomizer = energyPriorityEntry.top == 0 ? targets.length : energyPriorityEntry.top;
			topPriorityRandomizer = Math.min(topPriorityRandomizer, targets.length);
			return targets.slice(0, topPriorityRandomizer)[utilities.randomInt(topPriorityRandomizer)];
		}
	},

	build: function(creep) {
		var buildPriorities = prioritiesList.buildPriorities;

		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
		if (targets.length > 0) {
			targets.sort(function (a, b) {
				return(buildPriorities.findIndex(item => item.type == a.structureType) - buildPriorities.findIndex(item => item.type == b.structureType))
			});

			return targets[utilities.randomInt(targets.length)];
		}
	},

	energySource: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		return sources[utilities.randomInt(sources.length)];
	}
}

module.exports = priorities;