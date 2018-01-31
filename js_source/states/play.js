// Play loop state
ZORPG.State.add("play", {
    name: "Playing",
    turnPass: false,
    taldos: 0, //???

    init: function() {
        ZORPG.Canvas.setHUD("play");

        // Test code for player party - THIS IS HACKY, I know
        // TODO: Player should be stored somewhere else?(idea: build a singleton containing entities[actors])
        if (typeof ZORPG.Player === "undefined") { // TODO: Add check for create Player/Map/anything
            ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
            ZORPG.Monsters.init(); // TODO: This should read data from map or something like that
            ZORPG.Player = new ZORPG.Ent("player", ["pos", "party"]);
            ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
            ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
            ZORPG.Player.party.generateDefaultParty();

            ZORPG.Canvas.renderMap();
        }


        // Set key handlers
        var _this = this;
        ZORPG.Key.setPre(function(ev) {
            return (!ZORPG.Canvas.isUpdating);
        });
        ZORPG.Key.setPost(function(ev) {
            if (ev.code!== "Escape" && ev.code.indexOf("Arrow") < 0) {
                _this.update();
            }
        });

        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyW", function(ev) {
            ZORPG.Player.pos.moveFwd()
            _this.turnPass = true;
        });
        ZORPG.Key.add("KeyS", function(ev) {
            ZORPG.Player.pos.moveBck();
            _this.turnPass = true;
        });
        ZORPG.Key.add("KeyA", function(ev) {
            ZORPG.Player.pos.rotL()
        });
        ZORPG.Key.add("KeyD", function(ev) {
            ZORPG.Player.pos.rotR()
        });
        ZORPG.Key.add("Space", function(ev) {
            var data = ZORPG.Map.getScript(ZORPG.Player.pos.x, ZORPG.Player.pos.y);

            if (data) {
                ZORPG.State.set("script", {script: data});
            } else {
                _this.turnPass = true;
            }
        });

        // First activation of play state, pass a turn
        this.turnPass = true;
        this.update();
    },

    update: function() {
        this.taldos++;

        console.log("ZORPG.State.play: Updating")

        if (this.turnPass) {
            console.log("ZORPG.State.play: Turn pass.");
            ZORPG.$.log("Time passes...");
            this.turnPass = false;

            // Monsters
            ZORPG.Monsters.seekAndDestroy();
        }

        // Render and go to combat if needed
        ZORPG.Canvas.update(function() {
            console.log("ZORPG.State.play: update completed");

            if (ZORPG.Monsters.willFight()) {
                ZORPG.$.log("Combat begins!");
                ZORPG.State.set("combat");
            } else {
                //$("#console").html("Party Data:\nstatus: " + JSON.stringify(ZORPG.Player.party) + "\npos:" + JSON.stringify(ZORPG.Player.pos));
            }
        });
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
