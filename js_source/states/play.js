// Play loop state
ZORPG.State.add("play", {
    name: "Playing",

    init: function() {
        // ??? code. An Entity and a Map - THIS IS HACKY
        // TODO: Player should be stored somewhere else?(idea: build a singleton containing entities[actors])
        // TODO: Add check for create Player/Map/anytghin
        if (typeof ZORPG.Party === "undefined") {
            ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
            ZORPG.Party = new ZORPG.Ent("player", ["pos", "party"]);
            ZORPG.Party.pos.x = ZORPG.Map.properties.startX;
            ZORPG.Party.pos.y = ZORPG.Map.properties.startY;
            ZORPG.Canvas.renderMap(ZORPG.Map.getData());
        }




        // Set key handlers
        // TODO: add a post handler to update everything?
        ZORPG.Key.setPre(function(ev) {
            return (!ZORPG.Canvas.isUpdating);
        });

        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.removeAll();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyW", function(ev) {
            console.log("up")
            ZORPG.Party.pos.moveFwd()
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyS", function(ev) {
            console.log("down")
            ZORPG.Party.pos.moveBck();
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyA", function(ev) {
            console.log("left")
            ZORPG.Party.pos.rotL()
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyD", function(ev) {
            console.log("right")
            ZORPG.Party.pos.rotR()
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("Space", function(ev) {
            console.log("run script")
            var data = ZORPG.Map.getScript(ZORPG.Party.pos.x, ZORPG.Party.pos.y);

            if (data) {
                ZORPG.State.set("script", {script: data});
            }
        });
    },

    updatePlayer: function() {
        $("#console").html("Party Data:\nstatus: " + JSON.stringify(ZORPG.Party.party) + "\npos:" + JSON.stringify(ZORPG.Party.pos));
        ZORPG.Canvas.updateCamera(ZORPG.Party.pos);
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
