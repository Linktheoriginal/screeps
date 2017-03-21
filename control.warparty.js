var warParty = {
    minimumControllerLevel: 3,
    
    defineParty: function(room) {
        if (room.controller) {
            switch(room.controller.level) {
                case 3:
                    return ["tank", "fighter", "healer", "archer"]; 
                case 4:
                    return ["tank", "fighter", "healer", "archer"];
                case 5:
                    return ["tank", "fighter", "fighter", "healer", "archer", "archer"];
                case 6:
                    return ["tank", "fighter", "fighter", "healer", "archer", "archer"];
                case 7:
                    return ["tank", "fighter", "fighter", "fighter", "healer", "healer", "archer", "archer", "archer"];
                case 8:
                    return ["tank", "fighter", "fighter", "fighter", "healer", "healer", "archer", "archer", "archer"];
                default:
                    break;
            }
        }
    }
};

module.exports = warParty;