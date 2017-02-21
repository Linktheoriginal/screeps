var filters = require('utils.filters');

var utilities = {
	randomInt: function (range) {
		return Math.floor(Math.random() * range);
	},

	adjacent: function(room, pos, radius, adjacentFunction) {
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

		var returnValues = [(radius * 2) + 1][(radius * 2) + 1];
		for (var i = -radius; i <= radius; i++) {
			for (var j = -radius; j <= radius; j++) {
				returnValues[i + radius][j + radius] = adjacentFunction(room, pos.x + i, pos.y + j);
			}
		}
	},

	walkable(room, x, y) {
		return (_.filter(room.lookAt(x, y), filters.walkable).length == 0);
	},

	open(room, x, y) {
		return (_.filter(room.lookAt(x, y), filters.open).length == 0);
	}
}

module.exports = utilities;