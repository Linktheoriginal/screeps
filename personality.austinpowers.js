var utilities = require('utilities');

var sayings = [
	"Radical!",
	"Groovy!",
	"BASIL!",
	"Yeah, baby"
];

var austinPowersPersonality = {
	say: function(creep) {
		creep.say(sayings[utilities.randomInt(sayings.length)]);
	}
};

module.exports = austinPowersPersonality;