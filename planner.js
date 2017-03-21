var planner = {
    roadPlanner: require('planner.roads'),
    extensionPlanner: require('planner.extensions'),
    wallPlanner: require('planner.walls'),
    towerPlanner: require('planner.towers'),
    containerPlanner: require('planner.containers'),
    spawnPlanner: require('planner.spawn')
};

module.exports = planner;