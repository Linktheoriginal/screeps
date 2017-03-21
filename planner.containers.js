var containerPlanner = {
    planContainers: function(room) {
        //source pavilion
        var sources = room.find(FIND_SOURCES);
        for(var source in sources) {
            source = sources[source];
            for (var x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
                for (var y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
                    room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                }
            }
        }
    }
};

module.exports = containerPlanner;