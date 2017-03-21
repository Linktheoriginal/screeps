var utils = require('utils');
var bodyBuilder = require('control.roles.bodybuilder');

var roles = [
    {
        name: "fighter",
        body: function(room) {
            return bodyBuilder.fighter(room);
        }
    },
    {
        name: "healer",
        body: function(room) {
            return bodyBuilder.healer(room);
        }
    },
    {
        name: "archer",
        body: function(room) {
            return bodyBuilder.archer(room);
        }
    },
    {
    	name: "harvester",
    	body: function(room) {
            return bodyBuilder.harvester(room);
    	}
    },
    {
    	name: "upgrader",
    	body: function(room) {
    		return bodyBuilder.worker(room);
    	}
    },
    {
    	name: "builder",
    	body: function(room) {
    		return bodyBuilder.worker(room);
    	}
    },
    {
        name: "repairer",
        body: function(room) {
            return bodyBuilder.worker(room);
        }
    },
    {
        name: "wallbuilder",
        body: function(room) {
            return bodyBuilder.worker(room);
        }
    },
    {
        name: "transporter",
        body: function(room) {
            return bodyBuilder.transporter(room);
        }
    },
    {
        name: "scout",
        body: function(room) {
            return [MOVE];
        }
    },
    {
        name: "tank",
        body: function(room) {
            return bodyBuilder.tank(room);
        }
    }
];

module.exports = roles;