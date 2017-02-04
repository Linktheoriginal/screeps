var utilities = require('utilities');

function genericActionWithMove(creep, action, actionTarget, actionRange) {
	var sources = creep.pos.findInRange(actionTarget, actionRange);
	if (sources.length > 0) {
		creep[action](sources[0]);
	} else {
		sources = creep.room.find(actionTarget);
		creep.moveTo(sources[utilities.randomInt(sources.length)]);
	}
}

module.exports = genericActionWithMove;