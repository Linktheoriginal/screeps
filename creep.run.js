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
		}

		if (!control.quiet) {
			if (this.taskChanged) {
				creep.say(creep.memory.task);
			} else {
				personality(creep);
			}
		}
	},

    repairerBehavior: function (creep) {
        if (!creep.memory.task) {
			creep.memory.task = "harvesting";
		}
		
		 if (creep.carry.energy == 0) {
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

        if (creep.carry.energy == 0) {
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

		if (creep.carry.energy == 0) {
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

		if (creep.carry.energy == 0) {
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
				default:
					actionResult = creep[action](Game.getObjectById(creep.memory.target));
					if (actionResult == OK) {
						moveToTarget = false;
					} else if (actionResult == ERR_INVALID_TARGET) {
						delete creep.memory.target;
					}
			}
		}

		if (moveToTarget) {
			if (creep.moveTo(Game.getObjectById(creep.memory.target)) == ERR_INVALID_TARGET) {
				delete creep.memory.target;
			}
		}
	}
};

module.exports = creepLogic;