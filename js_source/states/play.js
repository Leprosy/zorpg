// Play loop state
ZORPG.State.add("play", {
    name: "Playing",
    turnPass: false,

    init: function() {
        ZORPG.Canvas.setHUD("play");

        // Test code. Player, Monsters and Map - THIS IS HACKY, I know
        // TODO: Player, monsters should be stored somewhere else?(idea: build a singleton containing entities[actors])
        // TODO: Add check for create Player/Map/anytghin
        if (typeof ZORPG.Player === "undefined") {
            var names = ["Lepro", "CragHack", "Maximus"];
            ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
            ZORPG.Player = new ZORPG.Ent("player", ["pos", "party"]);
            ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
            ZORPG.Player.pos.y = ZORPG.Map.properties.startY;

            for (var i = 0; i < 3; ++i) {
                var ent = new ZORPG.Ent("character" + i, ["actor"]);
                ent.actor.name = names[i];
                ent.actor.roll();
                ZORPG.Player.party.actors.push(ent);
            }

            ZORPG.Monsters = [];
            for (var i = 0; i < 3; ++i) {
                var ent = new ZORPG.Ent("monster" + i, ["pos", "actor", "monster"]);
                ent.pos.x = ZORPG.Utils.die("1d15")
                ent.pos.y = ZORPG.Utils.die("1d15");
                ent.actor.name = "Monster " + i;
                ent.actor.roll();
                ent.actor.spd += 5;
                ZORPG.Monsters.push(ent);
            }

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
        console.log("ZORPG.State.play: Updating")

        // If a turn pass, calculate world entities, check if combat
        var combat = false;
        var monster;

        if (this.turnPass) {
            console.log("ZORPG.State.play: Turn pass.");
            this.turnPass = false;

            // Monsters
            for (var i = 0; i < 3; ++i) {
                if (ZORPG.Monsters[i].pos.seek(ZORPG.Player.pos)) {
                    combat = true;
                    monster = ZORPG.Monsters[i];
                }
            }
        }

        // Render and go to combat if needed
        ZORPG.Canvas.update(function() {
            console.log("ZORPG.State.play: update completed");

            if (combat) {
                ZORPG.State.set("combat");
            } else {
                $("#console").html("Party Data:\nstatus: " + JSON.stringify(ZORPG.Player.party) + "\npos:" + JSON.stringify(ZORPG.Player.pos));
            }
        });
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});
