var utilities = require('utilities');

var sayings = [
	"Ugh...",
	"Whatever.",
	"Buzz off.",
	"This again"
];

var grumpyPersonality = {
	say: function(creep) {
		creep.say(sayings[utilities.randomInt(sayings.length)]);
	}
};

module.exports = grumpyPersonality;