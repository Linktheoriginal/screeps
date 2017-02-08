var utilities = {
	randomInt: function (range) {
		return Math.floor(Math.random() * range);
	},

	openAdjacent: function(room, pos) {
		//returns a two-dimensional left-handed array of open values
		//openAdjacent(pos)[0,0] is the bottom left open value 
		return  [[this.walkable(room, pos.x-1, pos.y-1), this.walkable(room, pos.x, pos.y-1), this.walkable(room, pos.x+1, pos.y-1)],
				[this.walkable(room, pos.x-1, pos.y), this.walkable(room, pos.x, pos.y), this.walkable(room, pos.x+1, pos.y)],
				[this.walkable(room, pos.x-1, pos.y+1), this.walkable(room, pos.x, pos.y+1), this.walkable(room, pos.x+1, pos.y+1)]];
	},

	walkable(room, x, y) {
		return (_.filter(room.lookAt(x, y), function(object) {
			return (object.type == 'structure' && object.structure.structureType != STRUCTURE_ROAD) || (object.type == 'terrain' && object.terrain == 'wall');
		}).length == 0);
	},

	open(room, x, y) {
		return (_.filter(room.lookAt(x, y), function(object) {
			return object.type == 'structure' || (object.type == 'terrain' && object.terrain == 'wall');
		}).length == 0);
	}
}

module.exports = utilities;