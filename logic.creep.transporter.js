var creepUtils = require('logic.creep.utils');
var priority = require('priority');

var transporterBehavior = function (creep) {
    //delete creep.memory.target;
    if (!creep.memory.task) {
        creep.memory.task = "fetch";
    }

    if (false && creep.memory.target && creep.memory.task == "deliver") { //for debugging delivery targeting
        var target = Game.getObjectById(creep.memory.target);
        creep.say((target.name == undefined) ? target.structureType : target.name);
    }

    if (creep.carry.energy == 0 && creep.memory.task == "deliver") {
        delete creep.memory.target;
        creep.memory.task = "fetch";
    } else if (creep.carry.energy == creep.carryCapacity && creep.memory.task == "fetch") {
        delete creep.memory.target;
        creep.memory.task = "deliver";
    }

    if (!creep.memory.target) {
        if (creep.memory.task == "deliver") {
            var deliveryTarget = priority.energySink(creep);

            if (deliveryTarget) {
                creep.memory.target = deliveryTarget.id;
            }
        } else {
            var fetchTarget = priority.energySource(creep);
            
            if (fetchTarget) {
                creep.memory.target = fetchTarget.id;
            }
        }
    }

    var moveSuccess = false;
    if (creep.memory.task == "deliver") {
        var actionResult = creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
        if (actionResult == OK || actionResult == ERR_FULL || actionResult == ERR_INVALID_TARGET) {
            delete creep.memory.target;
        } else {
            moveSuccess = creepUtils.moveToTarget(creep);
        }
    } else { //fetch
        if (creep.memory.target) {
            var target = Game.getObjectById(creep.memory.target);
            if (target) {
                if (target.structureType == STRUCTURE_CONTAINER) {
                    var actionResult = creep.withdraw(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
                    
                    if (actionResult == OK || actionResult == ERR_INVALID_TARGET || actionResult == ERR_NOT_ENOUGH_RESOURCES) {
                        delete creep.memory.target;
                    } else {
                        moveSuccess = creepUtils.moveToTarget(creep);
                    }
                } else if (target.resourceType == RESOURCE_ENERGY) {
                    moveSuccess = creepUtils.moveToTarget(creep);
                }
            }
        }
    }

    if (!moveSuccess) {
        delete creep.memory.target;
    }
};

module.exports = transporterBehavior;