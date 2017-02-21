var utilities = require('utils');

var personalities = [
	{
		name: "hulkhogan",
		personality: {
			sayings: [
				"Yeaaaah",
				"BROTHER",
				"SLIM JIM",
				"HULKIN'"
			],
			say: function(creep) {
				creep.say(this.sayings[utilities.randomInt(this.sayings.length)]);
			}
		}
	},
	{
		name: "austinpowers",
		personality: {
			sayings: [
				"Radical!",
				"Groovy!",
				"BASIL!",
				"Yeah, baby"
			],
			say: function(creep) {
				creep.say(this.sayings[utilities.randomInt(this.sayings.length)]);
			}
		}
	},
	{
		name: "upbeat",
		personality: {
			sayings: [
				"Let's go!",
				"Just DO IT",
				"GO GO GO",
				"We got it!",
				"Keep goin'"
			],
			say: function(creep) {
				creep.say(this.sayings[utilities.randomInt(this.sayings.length)]);
			}
		}
	},
	{
		name: "grumpy",
		personality : {
			sayings: [
				"Ugh...",
				"Whatever.",
				"Buzz off.",
				"This again"
			],
			say: function(creep) {
				creep.say(this.sayings[utilities.randomInt(this.sayings.length)]);
			}
		}
	}
];

var personality = {
	chooser: function() {
		return {
			name: personalities[utilities.randomInt(personalities.length)].name,
			talkativity: utilities.randomInt(10)
		}
	},

	personality: function(creep) {
		if (creep.memory.personality != undefined) {
			var creepPersonality = _.filter(personalities, (personality) => personality.name == creep.memory.personality.name)[0];
			//console.log(creepPersonality.name);
			if (utilities.randomInt(100) < creep.memory.personality.talkativity) {
				creepPersonality.personality.say(creep);
			}
		}
	}
};

module.exports = personality;