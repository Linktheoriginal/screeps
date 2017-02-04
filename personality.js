var utilities = require('utilities');
var personalities = require('personality.personalities');

function personality(creep) {
	if (creep.memory.personality != undefined) {
		var creepPersonality = _.filter(personalities, (personality) => personality.name == creep.memory.personality.name)[0];
		//console.log(creepPersonality.name);
		if (utilities.randomInt(100) < creep.memory.personality.talkativity) {
			creepPersonality.personality.say(creep);
		}
	}
}

module.exports = personality;