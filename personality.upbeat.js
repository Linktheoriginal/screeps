var utilities = require('utilities');

var sayings = [
	"Let's go!",
	"Just DO IT",
	"GO GO GO",
	"We got it!",
	"Keep goin'"
];

var upbeatPersonality = {
	say: function(creep) {
		creep.say(sayings[utilities.randomInt(sayings.length)]);
	}
};

module.exports = upbeatPersonality;