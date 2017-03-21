var utils = require('utils');
var control = require('control');
var priority = require('priority');
var creepUtils = require('logic.creep.utils');

var tankBehavior = function(creep) {
    //delete creep.memory.task;
    if (!creep.memory.task) {
        creep.memory.task = "defend";
    }

    if (creep.memory.target && !Game.getObjectById(creep.memory.target)) {
        delete creep.memory.target;
    }

    if (creep.memory.task == "defend") {
        var followers = utils.creepsByLeader(creep.room, creep.id);
        if (warPartyReady(control.warParty.defineParty(creep.room), followers)) {
            creep.memory.task = "attack";
        }
    }

    if (!creep.memory.target) {
        var roomEnemies = creep.room.find(FIND_HOSTILE_CREEPS).concat(creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType != STRUCTURE_CONTROLLER;
            }
        }));
        if (roomEnemies.length > 0) {
            creep.memory.target = roomEnemies[0].id;
        } else if (creep.room.name == creep.memory.targetRoom) {
            delete creep.memory.targetRoom;
        }
    }

    if (creep.memory.task == "attack" && !creep.memory.targetRoom) {
        var attackRoom = priority.attackRoom(creep);
        //console.log(attackRoom);
        if (attackRoom) {
            creep.memory.targetRoom = attackRoom.name;
        }
    }

    if (creep.memory.target) {
        creepUtils.creepAction(creep, "attack");
    } else if (creep.memory.targetRoom) {
        //creep.say("attack!!")
        var actionResult = creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {
            reusePath: 10,
            visualizePathStyle: {}
        });
        if (actionResult == ERR_NO_PATH) {
            delete creep.memory.targetRoom;
        }
    } else {
        creepUtils.shift(creep);
    }
};

function warPartyReady(warPartyDefinition, followers) {
    return followers.length >= warPartyDefinition.length;
}

module.exports = tankBehavior;