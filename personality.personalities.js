var grumpy = require('personality.grumpy');
var hulkhogan = require('personality.hulkhogan');
var austinpowers = require('personality.austinpowers');
var upbeat = require('personality.upbeat');

var personalities = [
	{
		name: "austinpowers",
		personality: austinpowers
	},
	{
		name: "hulkhogan",
		personality: hulkhogan
	},
	{
		name: "upbeat",
		personality: upbeat
	},
	{
		name: "grumpy",
		personality : grumpy
	}
];

module.exports = personalities;