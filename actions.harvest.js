var genericAction = require('actions.generic');

function harvest(creep) {
	genericAction(creep, "harvest", FIND_SOURCES, 1);
}

module.exports = harvest;