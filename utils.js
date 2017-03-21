var utilities = {
	directions: [
		TOP, 
		TOP_RIGHT, 
		RIGHT, 
		BOTTOM_RIGHT, 
		BOTTOM, 
		BOTTOM_LEFT, 
		LEFT, 
		TOP_LEFT
	],

	getEnergy(target) {
		if (target.carry == undefined) {
			return target.energy;
		}
		return target.carry.energy;
	},

	getEnergyCapacity(target) {
		if (target.carry == undefined) {
			return target.energyCapacity;
		}
		return target.carry.carryCapacity;
	},

	toggle(value, val1, val2) {
		if (value == val1) {
			return val2;
		} else {
			return val1;
		}
	},

	bodyCost(bodyDef) {
		var bodyCost = 0;
		for (var bodyPart in bodyDef) {
			bodyPart = bodyDef[bodyPart];
			bodyCost += BODYPART_COST[bodyPart];
		}
		return bodyCost;
	},

	randomInt(range) {
		return Math.floor(Math.random() * range);
	},

	adjacent(room, pos, radius, adjacentFunction) {
		if(typeof(adjacentFunction == "string")) {
			switch(adjacentFunction){
				case "walkable":
					adjacentFunction = this.walkable;
					break;
				case "open":
					adjacentFunction = this.open;
					break;
				default:
					return undefined;
			}
		}

		var returnValues = this.createArray((radius * 2) + 1, (radius * 2) + 1);
		for (var i = -radius; i <= radius; i++) {
			for (var j = -radius; j <= radius; j++) {
				returnValues[i + radius][j + radius] = adjacentFunction(room, pos.x + i, pos.y + j);
			}
		}
		return returnValues;
	},

	walkable(room, x, y) {
		var nonWalkableObjects = _.filter(room.lookAt(x, y), filters.notWalkable);
		return (nonWalkableObjects.length == 0);
	},

	open(room, x, y) {
		return (_.filter(room.lookAt(x, y), filters.notOpen).length == 0);
	},

	creepsByRole(room, role) {
		return room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return (creep.memory.role == role);
				}
			});
	},

	structuresByType(room, type) {
		return room.find(FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == type);
				}
			});
	},

	creepRoleCount(room, role) {
		return this.creepsByRole(room, role).length;
	},

	creepsByTarget(room, target) {
		return room.find(FIND_MY_CREEPS, {
			filter: function(creep) {
				return creep.memory.target == target;
			}
		});
	},

	creepsByLeader(room, leader) {
		return room.find(FIND_MY_CREEPS, {
			filter: function(creep) {
				return creep.memory.leader == leader;
			}
		});
	},

	sumBodyParts(creeps, bodyPartType) {
		var sum = 0;
		for (var creep in creeps) {
			creep = creeps[creep];
			sum += _.filter(creep.body, function(bodyPart) {
			    return bodyPart.type == bodyPartType;
			}).length;
		}
		return sum;
	},

	nextdoorRooms(currentRoomName) {
		var parsedExpression = /(W|E)(\d+)(N|S)(\d+)/.exec(currentRoomName);
		var latDirection = parsedExpression[1];
		var latDistance = parseInt(parsedExpression[2]);
		var lonDirection = parsedExpression[3];
		var lonDistance = parseInt(parsedExpression[4]);

		var returnRooms = [];
		
		// W/E towards 0, 0
		returnRooms.push(
			((latDistance == 0) ? this.toggle(latDirection, 'W', 'E') : latDirection) + 
			((latDistance == 0) ? 0 : (latDistance - 1)) + 
			lonDirection +
			lonDistance
		);

		// W/E away from 0, 0
		returnRooms.push(
			latDirection + 
			(latDistance + 1) +
			lonDirection +
			lonDistance
		);

		// N/S towards 0, 0
		returnRooms.push(
			latDirection +
			latDistance +
			((lonDistance == 0) ? this.toggle(lonDirection, 'N', 'S') : lonDirection) +
			((lonDistance == 0) ? 0 : (lonDistance - 1))
		);

		// N/S away from 0, 0
		returnRooms.push(
			latDirection + 
			latDistance +
			lonDirection +
			(lonDistance + 1)
		);

		//console.log(returnRooms);
		return returnRooms;
	},

	createArray(length) {
		//http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
		var arr = new Array(length || 0),
			i = length;

		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
		}

		return arr;
	},

	valueCountIn2DArray(arr, value) {
		var sum = 0;
		for (var x in arr) {
			x = arr[x];
			for (var y in x) {
				if (x[y] == value) {
					sum++;
				}
			}
		}
		return sum;
	},

	nearestOpen(room, pos) {
		var depth = 0;
		var pattern = [
			{x: -1, y: -1},
			{x: -1, y: 0},
			{x: -1, y: 1},
			{x: 0, y: -1},
			{x: 0, y: 1},
			{x: 1, y: -1},
			{x: 1, y: 0},
			{x: 1, y: 1}
		];
		var locations = [{
			x: pos.x,
			y: pos.y
		}];

		while (depth < 10) {
			var newLocations = [];
			for (var location in locations) {
				location = locations[location];
				if (this.open(room, location.x, location.y)) {
					return location;
				} else {
					for (var patternStep in pattern) {
						patternStep = pattern[patternStep];
						newLocations.push({
							x: location.x + patternStep.x,
							y: location.y + patternStep.y
						});
					}
				}
			}
			locations = newLocations;
			depth = depth + 1;
		}
	}, 

	totalCreepEnergy(creeps) {
		return creeps.reduce(function(creep){
			if (!creep.carry) {
				return 0;
			}
			return creep.carry.energy;
		}, 0);
	},

	totalCreepEnergyCapacity(creeps) {
		return creeps.reduce(function(acc, creep) {
			return acc + creep.carryCapacity;
		}, 0);
	},

	sortCreepsByEnergy(creeps) {
		return creeps.sort(function (a, b) {
			return a.carry.energy - b.carry.energy;
		});
	},

	halfEnergyCreeps(creeps) {
		return _.filter(creeps, function(creep) {
			return creep.carry.energy < creep.carryCapacity / 2;
		});
	},

	noEnergyCreeps(creeps) {
		return _.filter(creeps, function(creep) {
			return creep.carry.energy == 0;
		});
	},

    halfEnergyStructures(structures) {
        return _.filter(structures, function(structure) {
            return structure.energy < structure.energyCapacity / 2;
        });
    },

	noEnergyStructures(structures) {
		return _.filter(structures, function(structure) {
			return structure.energy == 0;
		});
	},

	listTargetNames(targets) {
		return targets.map(function(target) {
			if (target.name) {
				return target.name;
			} else if (target.structureType) {
				return target.structureType;
			} else {
				return target.id;
			}
		});
	}
}

var filters = {

	notWalkable: function(lookAtObject) {
		//console.log(lookAtObject.type + lookAtObject.terrain + lookAtObject.structure.structureType);
		var isNonWalkableTerrain = ((lookAtObject.type == 'terrain' && lookAtObject.terrain == "wall") || lookAtObject.type == "source");

		var isNonWalkableStructure = ((lookAtObject.type == 'structure') && 
			(lookAtObject.structure.structureType != STRUCTURE_ROAD 
			&& lookAtObject.structure.structureType != STRUCTURE_CONTAINER 
			&& lookAtObject.structure.structureType != STRUCTURE_RAMPART));

		return (isNonWalkableTerrain || isNonWalkableStructure);
	},

	notOpen: function(lookAtObject) {
		return (lookAtObject.type == 'creep' 
			|| lookAtObject.type == 'structure'
			|| lookAtObject.type == 'constructionSite'
			|| (lookAtObject.type == 'terrain' && lookAtObject.terrain == 'wall')
			|| (lookAtObject.type == "source"));
	}
};

module.exports = utilities;