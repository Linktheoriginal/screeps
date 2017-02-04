var roomSpawnTargets = [
    {
    	role: require('roles.harvester'),
    	target: function() {
    		return 2;
    	}
    },
    {
    	role: require('roles.builder'), 
    	target: function() {
    		return 6;
    	}
    },
    {
    	role: require('roles.upgrader'), 
    	target: function() {
    		return 2;
    	}
    }
];

module.exports = roomSpawnTargets;