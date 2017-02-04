var genericAction = require('actions.generic');

function build(creep) {
	genericAction(creep, "build", FIND_CONSTRUCTION_SITES, 3);
}

module.exports = build;