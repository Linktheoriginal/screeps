var filters = require('utils.filters');

var utilities = {
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
		return (_.filter(room.lookAt(x, y), filters.walkable).length == 0);
	},

	open(room, x, y) {
		return (_.filter(room.lookAt(x, y), filters.open).length == 0);
	},

	creepsByRole(room, role) {
		return room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return (creep.memory.role == role);
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

	sumBodyParts(creeps, bodyPartType) {
		var sum = 0;
		for (var creep in creeps) {
			creep = creeps[creep];
			sum += _.filter(creep.body, (bodyPart) => bodyPart.type == bodyPartType).length;
		}
		return sum;
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
	}
}

module.exports = utilities;