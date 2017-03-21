var control = require('control');
var personality = require('personality');
var priority = require('priority');
var utils = require('utils');
var harvesterBehavior = require('logic.creep.harvester');
var transporterBehavior = require('logic.creep.transporter');
var scoutBehavior = require('logic.creep.scout');
var repairerBehavior = require('logic.creep.repairer');
var creepUtils = require('logic.creep.utils');
var tankBehavior = require('logic.creep.tank');

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
				harvesterBehavior(creep);
				break;
			case "builder":
				this.builderBehavior(creep);
				break;
			case "upgrader":
				this.upgraderBehavior(creep);
				break;
			case "repairer":
			    repairerBehavior(creep, false);
			    break;
			case "transporter":
				transporterBehavior(creep);
				break;
			case "scout":
				scoutBehavior(creep);
				break;
			case "wallbuilder":
				repairerBehavior(creep, true);
				break;
			case "tank":
				tankBehavior(creep);
			case "fighter":
				this.fighterBehavior(creep);
				break;
			case "healer":
				this.healerBehavior(creep);
				break;
			case "archer":
				this.archerBehavior(creep);
				break;
			case "colonist":
				this.colonistBehavior(creep);
				break;
		}

		if (!control.quiet) {
			personality(creep);
		}
	},

	fighterBehavior: function (creep) {
		//delete creep.memory.target;
		getLeader(creep);

		if (!creep.memory.target || !Game.getObjectById(creep.memory.target)) {
			var attackTarget = priority.melee(creep);
			if (attackTarget) {
				creep.memory.target = attackTarget.id;
			}
		}
		if (creep.memory.target) {
			creepUtils.creepAction(creep, "attack");
		} else if (creep.memory.leader) {
		    stayNearLeader(creep);
		}
	},

	healerBehavior: function (creep) {
		getLeader(creep);

		if (!creep.memory.target || !Game.getObjectById(creep.memory.target)) {
			var healTarget = priority.heal(creep);
			if (healTarget) {
				creep.memory.target = healTarget.id;
			}
		}
		if (creep.memory.target) {
			creepUtils.creepAction(creep, "heal");
		} else if (creep.memory.leader) {
			stayNearLeader(creep);
		}
	},

	archerBehavior: function (creep) {
		//delete creep.memory.target;
		getLeader(creep);

		if (!creep.memory.target || !Game.getObjectById(creep.memory.target)) {
			var rangedTarget = priority.ranged(creep);
			if (rangedTarget) {
				creep.memory.target = rangedTarget.id;
			}
		}
		if (creep.memory.target) {
			creepUtils.creepAction(creep, "rangedAttack");
		} else if (creep.memory.leader) {
			stayNearLeader(creep);
		}
	},
	
	colonistBehavior: function (creep) {
		if (!creep.memory.target || !Game.getObjectById(creep.memory.target)) {
			creep.memory.target = priority.colonize(creep).id;
		}
		if (!creepUtils.creepAction(creep, "claimController")) {
			creepUtils.creepAction(creep, "reserveController");
		}
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
		creepUtils.creepAction(creep, "build");
	},

	upgraderBehavior: function (creep) {
		if (!creep.memory.target) {
			creep.memory.target = creep.room.controller.id;
		}
		creepUtils.creepAction(creep, "upgradeController");
	}
};

function getLeader(creep) {
	if (!creep.memory.leader || !Game.getObjectById(creep.memory.leader)) {
		var tanks = creep.room.find(FIND_MY_CREEPS, {
			filter: function(creep) {
				return creep.memory.role == "tank"
			}
		});
		if (tanks.length > 0) {
			creep.memory.leader = tanks[0].id;
		}
	}
}

function stayNearLeader(creep) {
    if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.leader)) > 2) {
        creep.moveTo(Game.getObjectById(creep.memory.leader));
    }
}

module.exports = creepLogic;