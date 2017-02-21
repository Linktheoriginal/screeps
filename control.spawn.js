var spawnControls = {
    roomLimit: 10,
    currentCreepCount: function(room) {
        
    }
    roomSpawnTargets: [
        {
            role: 'harvester',
            target: function(room) {


                if (room.find(FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return (creep.memory.role == "heavyHarvester");
                        }
                    }).length > 1) {
                        return 0;
                }

                var structures = room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => { 
                        return(structure.structureType == STRUCTURE_SPAWN ||
                               structure.structureType == STRUCTURE_EXTENSION ||
                               structure.structureType == STRUCTURE_TOWER) &&
                               structure.energy < structure.energyCapacity;
                    }
                });
                
                if (structures.length == 1) {
                    return 1;
                } else {
                    return Math.min(Math.ceil(structures.length / 2), 5);
                }
            }
        },
        {
            role: 'builder', 
            target: function(room) {
                
                if (room.find(FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return (creep.memory.role == "heavyBuilder");
                        }
                    }).length > 1) {
                        return 0;
                }
                
                var buildTargets = room.find(FIND_MY_CONSTRUCTION_SITES).length;
                if (buildTargets == 1) {
                    return 1;
                } else {
                    return Math.min(Math.floor(buildTargets / 2), 4);
                }
            }
        },
        {
            role: 'upgrader', 
            target: function(room) {
                if (room.find(FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return (creep.memory.role == "heavyUpgrader");
                        }
                    }).length > 1) {
                        return 0;
                }

                return 2;
            }
        },
        {
            role: 'repairer',
            target: function(room) {
                if (room.find(FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return (creep.memory.role == "heavyRepairer");
                        }
                    }).length > 1) {
                        return 0;
                }
                return 2;
            }
        },
        {
            role: 'heavyHarvester',
            target: function(room) {
                return 2;
            }
        },
        {
            role: 'heavyBuilder',
            target: function(room) {
                return 1;
            }
        },
        {
            role: 'transporter',
            target: function(room) {
                return 2;
            }
        },
        {
            role: 'heavyUpgrader',
            target: function(room) {
                return 2;
            }
        }
    ],
    spawnPriorities: [
        "harvester",
        "upgrader",
        "builder",
        "repairer",
        "heavyHarvester",
        "transporter",
        "heavyUpgrader"
    ]
};

module.exports = spawnControls;