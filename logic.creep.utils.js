var utils = require('utils');

var creepUtils = {
    creepAction: function(creep, action) {
        if (creep.memory.target) {
            var actionResult = creep[action](Game.getObjectById(creep.memory.target));
            switch(actionResult) {
                case ERR_INVALID_TARGET:
                    creep.say("BadTarget");
                    this.shift(creep);
                    delete creep.memory.target;
                    return false;
                case ERR_NOT_ENOUGH_RESOURCES:
                case ERR_NOT_IN_RANGE:
                    if (!this.moveToTarget(creep)) {
                        creep.say("BadMove");
                        delete creep.memory.target;
                        return false;
                    }
                    return true; //true because we successfully moved towards it
                case ERR_GCL_NOT_ENOUGH:
                    return false;
                case ERR_NO_BODYPART:
                    delete creep.memory.role;
                    return false;
                default:
                    return true;
            }
        }
    },
    
    moveToTarget: function(creep) {
        var actionResult = creep.moveTo(Game.getObjectById(creep.memory.target), { reusePath: 10 });
        if (actionResult == ERR_INVALID_TARGET) {
            return false;
        }
        return true;
    },

    shift: function(creep) {
        var direction = utils.directions[utils.randomInt(utils.directions.length)];
        creep.move(direction);
    }
};

module.exports = creepUtils;