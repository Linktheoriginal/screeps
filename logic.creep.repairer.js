var creepUtils = require('logic.creep.utils');
var priority = require('priority');

var repairerBehavior = function (creep, isWallbuilder) {
    if (creep.memory.target && Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
        delete creep.memory.target;
    }    
    if (!creep.memory.target) {
        var repairTarget;
        if (isWallbuilder) {
            repairTarget = priority.wall(creep);
        } else {
            repairTarget = priority.repair(creep);
        }

        if (!repairTarget) {
            creep.say("convert");
            delete creep.memory.role;
        } else {
            creep.memory.target = repairTarget.id;
        }
    }
    creepUtils.creepAction(creep, "repair");
};

module.exports = repairerBehavior;