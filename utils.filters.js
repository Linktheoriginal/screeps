filters = {
	walkable: function(lookAtObject) {
		return (lookAtObject.type == 'structure' && lookAtObject.structure.structureType != STRUCTURE_ROAD)
			|| (lookAtObject.type == 'terrain' && lookAtObject.terrain == 'wall');
	},
	open: function(lookAtObject) {
		return (lookAtObject.type == 'creep' 
			|| lookAtObject.type == 'structure'
			|| lookAtObject.type == 'constructionSite'
			|| (lookAtObject.type == 'terrain' && lookAtObject.terrain == 'wall'));
	}
};

module.exports = filters;