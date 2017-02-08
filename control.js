var control = {
	spawn: require('control.spawn'),
	roles: require('roles'),
	quiet: true,
	priorityStrategy: "closest",
	priorities: require('control.priority')
};

module.exports = control;