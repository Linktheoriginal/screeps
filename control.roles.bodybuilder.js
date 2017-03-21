//these functions will return the minimum body size regardless of the energy limit set()

var utils = require('utils');

function growBody(maxSize, bodyStart, bodyGrowth, maxGrowthSize) {
    var bodyGrowthSize = Math.floor((maxSize - utils.bodyCost(bodyStart)) / utils.bodyCost(bodyGrowth));
    bodyGrowthSize = Math.min(bodyGrowthSize, maxGrowthSize)
    var bodyDefinition = bodyStart;
    for (i = 0; i < bodyGrowthSize; i++) {
        bodyDefinition = bodyGrowth.concat(bodyDefinition);
    }
    return bodyDefinition;
};

function setSize(room) {
    return Math.min(room.energyCapacityAvailable / 2, room.energyAvailable)
};

var bodyBuilder = {
    balanced(room) {
        return growBody(setSize(room), [WORK, CARRY, MOVE], [WORK, CARRY, MOVE], 2);
    },

    harvester(room) {
        return growBody(room.energyAvailable, [WORK, WORK, MOVE, MOVE], [WORK], 3);
    },

    worker(room) {
        return growBody(setSize(room), [WORK, CARRY, MOVE, MOVE], [WORK, CARRY], 3);
    },

    transporter(room) {
        return growBody(setSize(room), [CARRY, CARRY, MOVE, MOVE], [CARRY, CARRY, MOVE], 1);
    },

    fighter(room) {
        return growBody(setSize(room), [TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK], [TOUGH, ATTACK], 4)
    },

    healer(room) {
        return growBody(setSize(room), [TOUGH, MOVE, MOVE, HEAL], [TOUGH, HEAL], 2);
    },

    archer(room) {
        return growBody(setSize(room), [TOUGH, MOVE, MOVE, RANGED_ATTACK], [TOUGH, RANGED_ATTACK], 2);
    },

    tank(room) {
        return growBody(setSize(room), [TOUGH, MOVE, MOVE, ATTACK], [TOUGH], 5)
    }
};

module.exports = bodyBuilder;