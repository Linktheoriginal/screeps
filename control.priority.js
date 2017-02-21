var priorities = {
	energyPriorities : [
		{type: STRUCTURE_SPAWN, top: 1},
		{type: STRUCTURE_EXTENSION, top: 1},
		{type: STRUCTURE_TOWER, top: 0},
		{role: "heavyUpgrader", top: 0},
		{role: "heavyBuilder", top: 0},
		{type: STRUCTURE_CONTAINER, top: 0}
	],
	buildPriorities: [
		{type: STRUCTURE_SPAWN},
		{type: STRUCTURE_EXTENSION},
		{type: STRUCTURE_TOWER},
		{type: STRUCTURE_WALL},
		{type: STRUCTURE_RAMPART},
		{type: STRUCTURE_ROAD}
	]
};

module.exports = priorities;