var control = require('control');
var personality = require('personality');
var priority = require('priority');

var creepLogic = {
	taskChanged: false,

	run: function(creep) {
		this.taskChanged = false;
		if (!creep.memory.role) {
			creep.memory.role = "harvester";
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
			case "heavyHarvester":
				this.heavyHarvesterBehavior(creep);
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
			case "heavyUpgrader":
				this.heavyUpgraderBehavior(creep);
				break;
			case "heavyBuilder":
				this.heavyBuilderBehavior(creep);
				break;
			case "transporter":
				this.transporterBehavior(creep);
				break;
		}

		if (!control.quiet) {
			if (this.taskChanged) {
				creep.say(creep.memory.task);
			} else {
				personality(creep);
			}
		}
	},

	transporterBehavior: function (creep) {
		if (creep.carry.energy < creep.carryCapacity) {
			creep.memory.target = priority.energySource(creep).id;
		} else {
			creep.memory.target = priority.energy(creep).id;
		}
		creep.moveTo(Game.getObjectById(creep.memory.target));
		this.creepAction(creep, "transfer");
	},

	heavyHarvesterBehavior: function (creep) {
		if (!creep.memory.target) {
			creep.memory.target = priority.energySource(creep).id;
		}
		if (creep.carry.energy > 0) {
			this.creepAction(creep, "handoff");
		}
		this.creepAction(creep, "harvest");
	},

	heavyBuilderBehavior: function (creep) {
		if (!creep.memory.target) {
			creep.memory.target = priority.build(creep).id;
		}
		if (creep.carry.energy > 0) {
			this.creepAction(creep, "steal");
		}
		this.creepAction(creep, "build");
	},

	heavyUpgraderBehavior: function (creep) {
		if (true){ //!creep.memory.target) {
			creep.memory.target = creep.room.controller.id;
		}
		if (creep.carry.energy < creep.carryCapacity) {
			this.creepAction(creep, "steal");
		}
		this.creepAction(creep, "upgradeController");
	},

    repairerBehavior: function (creep) {
        if (!creep.memory.task) {
			creep.memory.task = "harvesting";
		}
		
		if (creep.carry.energy == 0 && creep.memory.task != "harvesting") {
            creep.memory.task = "harvesting";
            this.taskChanged = true;
	    } else if (creep.memory.task == "harvesting" && creep.carry.energy == creep.carryCapacity) {
	    	creep.memory.task = "repairing";
	    	this.taskChanged = true;
	    }
	    
	    if (this.taskChanged || !creep.memory.target) {
	    	if (creep.memory.task == "harvesting") {
				creep.memory.target = priority.energySource(creep).id;
			} else {
				var repairTarget = priority.repair(creep);
				if (!repairTarget) {
					creep.memory.role = "harvester";
				} else {
					creep.memory.target = repairTarget.id;
				}
			}
	    }
	    
	    if (creep.memory.task == "harvesting") {
	    	this.creepAction(creep, "harvest");
        } else {
            this.creepAction(creep, "repair");
            if (Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                delete creep.memory.target;
            }
        }
    },

	upgraderBehavior: function (creep) {
		if (!creep.memory.task) {
			creep.memory.task = "harvesting";
		}

        if (creep.carry.energy == 0 && creep.memory.task != "harvesting") {
            creep.memory.task = "harvesting";
            this.taskChanged = true;
	    } else if (creep.memory.task == "harvesting" && creep.carry.energy == creep.carryCapacity) {
	    	creep.memory.task = "upgrading";
	    	this.taskChanged = true;
	    }

	    if (this.taskChanged || !creep.memory.target) {
	    	if (creep.memory.task == "harvesting") {
				creep.memory.target = priority.energySource(creep).id;
			} else {
				creep.memory.target = creep.room.controller.id;
			}
	    }

	    if (creep.memory.task == "harvesting") {
	    	this.creepAction(creep, "harvest");
        } else {
            this.creepAction(creep, "upgradeController");
        }
	},

	harvesterBehavior: function (creep) {
		if (!creep.memory.task) {
			creep.memory.task = "harvesting";
		}

		if (creep.carry.energy == 0 && creep.memory.task != "harvesting") {
			creep.memory.task = "harvesting";
			this.taskChanged = true;
		} else if (creep.memory.task == "harvesting" && creep.carry.energy == creep.carryCapacity) {
			creep.memory.task = "delivering";
			this.taskChanged = true;
		}

		if (this.taskChanged || !creep.memory.target) {
			if (creep.memory.task == "harvesting") {
				creep.memory.target = priority.energySource(creep).id;
			} else {
				var transferTarget = priority.energy(creep);
				if (!transferTarget) {
					creep.memory.role = "upgrader";
				} else {
					creep.memory.target = priority.energy(creep).id;
				}
			}
		}

		if (creep.memory.task == "harvesting") {
            this.creepAction(creep, "harvest");
        } else {
            this.creepAction(creep, "transfer");
        }
	},

	builderBehavior: function(creep) {
		if (!creep.memory.task) {
			creep.memory.task = "harvesting";
		}

		if (creep.carry.energy == 0 && creep.memory.task != "harvesting") {
			creep.memory.task = "harvesting";
			this.taskChanged = true
		} else if (creep.memory.task == "harvesting" && creep.carry.energy == creep.carryCapacity) {
			creep.memory.task = "building";
			this.taskChanged = true;
		}

		if (this.taskChanged || !creep.memory.target) {
			if (creep.memory.task == "harvesting") {
				creep.memory.target = priority.energySource(creep).id;
			} else {
				var buildTarget = priority.build(creep);
				if (!buildTarget) {
					creep.memory.role = "harvester";
				} else {
				    //console.log(buildTarget);
				    //creep.say("target is " + buildTarget.id);
					creep.memory.target = buildTarget.id;
				}
			}
		}

	    if (creep.memory.task == "harvesting") {
	    	this.creepAction(creep, "harvest");
	    } else {
	        this.creepAction(creep, "build");
	    }
	},

	creepAction: function(creep, action) {
		var moveToTarget = true;
		var actionResult;

		if (creep.memory.target) {
			switch (action) {
				case "transfer":
					actionResult = creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
					
					if (actionResult == OK || actionResult == ERR_FULL || actionResult == ERR_INVALID_TARGET) {
						delete creep.memory.target;
						moveToTarget = false;
					}
					break;
				case "handoff":
					var handoffTargets = creep.pos.findInRange(FIND_MY_CREEPS, 1);
					for (var target in handoffTargets) {
						target = handoffTargets[target];
						creep.transfer(target, RESOURCE_ENERGY);
					}
					break;
				case "steal":
					var stealTargets = creep.pos.findInRange(FIND_MY_CREEPS, 1);
					for (var target in stealTargets) {
						stealTargets[target].transfer(creep, RESOURCE_ENERGY);
					}
					break;
				default:
					actionResult = creep[action](Game.getObjectById(creep.memory.target));
					if (actionResult == OK) {
						moveToTarget = false;
					} else if (actionResult == ERR_INVALID_TARGET) {
						creep.say("!2");
						delete creep.memory.target;
					}
			}
		}

		if (moveToTarget) {
			if (creep.moveTo(Game.getObjectById(creep.memory.target)) == ERR_INVALID_TARGET) {
				creep.say("!1");
				delete creep.memory.target;
			}
		}
	}
};

module.exports = creepLogic;