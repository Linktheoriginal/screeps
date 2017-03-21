var creepUtils = require('logic.creep.utils');
var priority = require('priority');
var utils = require('utils');
var control = require('control');

var scoutBehavior = function (creep) {
    //delete creep.memory.target;
    if (!creep.memory.target) {
        creep.memory.target = creep.room.name;
    }
    var roomScouts = utils.creepsByRole(creep.room, "scout");
    if (roomScouts.findIndex(scout => scout.id != creep.id && scout.memory.target == creep.memory.target && scout.memory.target == creep.room.name) > -1) {
		var roomTargets = utils.nextdoorRooms(creep.room.name);
        creep.memory.target = roomTargets[utils.randomInt(roomTargets.length)];
        if (!control.quiet) {
            creep.say("Scoutin'!");
        }
    }
    if (creep.memory.target && creep.moveTo(new RoomPosition(25, 25, creep.memory.target)) == ERR_NO_PATH) {
        delete creep.memory.target;
    }
};

module.exports = scoutBehavior;