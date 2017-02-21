filters = {
	walkable: function(lookAtObject) {
		return (object.type == 'structure' && object.structure.structureType != STRUCTURE_ROAD)
			|| (object.type == 'terrain' && object.terrain == 'wall');
	},
	open: function(lookAtObject) {
		return (object.type == 'creep' 
			|| object.type == 'structure' 
			|| (object.type == 'terrain' && object.terrain == 'wall'));
	}
};

module.exports = filters;