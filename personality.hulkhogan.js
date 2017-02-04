var utilities = require('utilities');

var sayings = [
	"Yeaaaah",
	"BROTHER",
	"SLIM JIM",
	"HULKIN'"
];

var hoganPersonality = {
	say: function(creep) {
		creep.say(sayings[utilities.randomInt(sayings.length)]);
	}
};

module.exports = hoganPersonality;