var roles = [
    {
    	name: "harvester",
    	body: function(energyAvailable) {
    		return [WORK,MOVE,CARRY];
    	}
    },
    {
    	name: "upgrader",
    	body: function(energyAvailable) {
    		return [WORK,MOVE,CARRY];
    	}
    },
    {
    	name: "builder",
    	body: function(energyAvailable) {
    		return [WORK,MOVE,CARRY];
    	}
    }
];

module.exports = roles;