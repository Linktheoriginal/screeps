var control = require('control');
var personality = require('personality');
var priority = require('priority');

var creepLogic = {

	run: function(creep) {
		if (!creep.memory.role) {
			creep.say("Forgot?!?!")
			creep.memory.role = "transporter";
		}

		if (creep.carry.energy < creep.carryCapacity) {
			var freeEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
			for (var energy in freeEnergy) {
				creep.pickup(freeEnergy[energy]);
			}
		}

		switch (creep.memory.role) {
			case "harvester":
				this.harvesterBehavior(creep);
				break;
			case "builder":
				this.builderBehavior(creep);
				break;
			case "upgrader":
				this.upgraderBehavior(creep);
				break;
			case "repairer":
			    this.repairerBehavior(creep);
			    break;
			case "transporter":
				this.transporterBehavior(creep);
				break;
		}

		if (!control.quiet) {
			personality(creep);
		}
	},

	transporterBehavior: function (creep) {
		//delete creep.memory.target;
		if (!creep.memory.task) {
			creep.memory.task = "fetch";
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

		if (creep.memory.task == "deliver") {
			var actionResult = creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
			if (actionResult == OK || actionResult == ERR_FULL || actionResult == ERR_INVALID_TARGET) {
				delete creep.memory.target;
			} else {
				moveToTarget(creep);
			}
		} else {
			moveToTarget(creep);
		}
	},

	harvesterBehavior: function (creep) {
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
		creepAction(creep, "harvest");
	},

	builderBehavior: function (creep) {
		if (!creep.memory.target) {
			var buildTarget = priority.build(creep);
			if (!buildTarget) {
				creep.say("No build sites.")
				delete creep.memory.role;
			} else {
				creep.memory.target = buildTarget.id;
			}
		}
		creepAction(creep, "build");
	},

	upgraderBehavior: function (creep) {
		if (!creep.memory.target) {
			creep.memory.target = creep.room.controller.id;
		}
		creepAction(creep, "upgradeController");
	},

    repairerBehavior: function (creep) {
		if (creep.memory.target && Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
			delete creep.memory.target;
		}    
	    if (!creep.memory.target) {
			var repairTarget = priority.repair(creep);
			if (!repairTarget) {
				delete creep.memory.role;
			} else {
				creep.memory.target = repairTarget.id;
			}
	    }
		creepAction(creep, "repair");
    }
};

function creepAction(creep, action) {
	if (creep.memory.target) {
		var actionResult = creep[action](Game.getObjectById(creep.memory.target));
		//console.log(actionResult + " " + creep.memory.role);
		switch(actionResult) {
			case ERR_INVALID_TARGET:
				creep.say("BadTarget");
				delete creep.memory.target;
				break;
			case ERR_NOT_ENOUGH_ENERGY:
			case ERR_NOT_IN_RANGE:
				if (!moveToTarget(creep)) {
					creep.say("BadMove");
					delete creep.memory.target;
				}
				break;
			default:
				break;
		}
	}
};

function moveToTarget(creep) {
	var actionResult = creep.moveTo(Game.getObjectById(creep.memory.target));
	if (actionResult == ERR_INVALID_TARGET) {
		return false;
	}
	return true;
};

module.exports = creepLogic;