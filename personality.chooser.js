var utilities = require('utilities');
var personalities = require('personality.personalities');

var personalityChooser = function() {
	return {
		name: personalities[utilities.randomInt(personalities.length)].name,
		talkativity: utilities.randomInt(10)
	}
};

module.exports = personalityChooser;
