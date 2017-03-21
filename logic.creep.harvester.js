var creepUtils = require('logic.creep.utils');
var priority = require('priority');

var harvesterBehavior = function (creep) {
    //delete creep.memory.target;
    if (!creep.memory.target) {
        creep.memory.target = priority.harvest(creep).id;
    }
    if (creep.carry.energy > 0) {
        var handoffTargets = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: function(creep) {
                return creep.memory.role == "transporter";
            }
        });
        if (handoffTargets.length > 0) {
            creep.transfer(handoffTargets[0], RESOURCE_ENERGY);
        }
    }
    creepUtils.creepAction(creep, "harvest");
}

module.exports = harvesterBehavior;