var logicUtils = {
	isOvercrowded: function(room, pos, range) {

	},
	changeTask: function(creep, newTask, condition) {
		if(condition) {
			creep.memory.task = newTask;
		}
	},
	setDefaultBehavior: function(creep, task) {
		if (!creep.memory.task) {
			creep.memory.task = task;
		}
	}
};

module.exports = logicUtils;