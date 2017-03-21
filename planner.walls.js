var wallPlanner = {
    planWalls(room) {
        
        //north wall
        var placeRampart = true;
        for (var x = 1; x <= 48; x++) {
            if (Game.map.getTerrainAt(x, 0, room.name) != "wall" && Game.map.getTerrainAt(x, 2, room.name) != "wall") {
                if (placeRampart) {
                    room.createConstructionSite(x, 2, STRUCTURE_RAMPART);
                    placeRampart = false;
                } else {
                    room.createConstructionSite(x, 2, STRUCTURE_WALL);
                }
            } else {
                if (Game.map.getTerrainAt(x - 2, 0, room.name) != "wall" || Game.map.getTerrainAt(x + 2, 0, room.name) != "wall") {
                    room.createConstructionSite(x, 1, STRUCTURE_WALL);
                    room.createConstructionSite(x, 2, STRUCTURE_WALL);
                }
            }
        }

        //south wall
        placeRampart = true;
         for (var x = 1; x <= 48; x++) {
            if (Game.map.getTerrainAt(x, 49, room.name) != "wall" && Game.map.getTerrainAt(x, 49, room.name) != "wall") {
                 if (placeRampart) {
                    room.createConstructionSite(x, 47, STRUCTURE_RAMPART);
                    placeRampart = false;
                } else {
                    room.createConstructionSite(x, 47, STRUCTURE_WALL);
                }
            } else {
                if (Game.map.getTerrainAt(x - 2, 49, room.name) != "wall" || Game.map.getTerrainAt(x + 2, 49, room.name) != "wall") {
                    room.createConstructionSite(x, 48, STRUCTURE_WALL);
                    room.createConstructionSite(x, 47, STRUCTURE_WALL);
                }
            }
        }

        //west wall
        placeRampart = true;
         for (var y = 1; y <= 48; y++) {
            if (Game.map.getTerrainAt(0, y, room.name) != "wall" && Game.map.getTerrainAt(2, y, room.name) != "wall") {
                 if (placeRampart) {
                    room.createConstructionSite(2, y, STRUCTURE_RAMPART);
                    placeRampart = false;
                } else {
                    room.createConstructionSite(2, y, STRUCTURE_WALL);
                }
            } else {
                if (Game.map.getTerrainAt(0, y - 2, room.name) != "wall" || Game.map.getTerrainAt(0, y + 2, room.name) != "wall") {
                    room.createConstructionSite(1, y, STRUCTURE_WALL);
                    room.createConstructionSite(2, y, STRUCTURE_WALL);
                }
            }
        }

        //east wall
        placeRampart = true;
         for (var y = 1; y <= 48; y++) {
            if (Game.map.getTerrainAt(49, y, room.name) != "wall" && Game.map.getTerrainAt(49, y, room.name) != "wall") {
                 if (placeRampart) {
                    room.createConstructionSite(47, y, STRUCTURE_RAMPART);
                    placeRampart = false;
                } else {
                    room.createConstructionSite(47, y, STRUCTURE_WALL);
                }
            } else {
                if (Game.map.getTerrainAt(49, y - 2, room.name) != "wall" || Game.map.getTerrainAt(49, y + 2, room.name) != "wall") {
                    room.createConstructionSite(48, y, STRUCTURE_WALL);
                    room.createConstructionSite(47, y, STRUCTURE_WALL);
                }
            }
        }
    }
}

module.exports = wallPlanner;