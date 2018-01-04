// Play loop state
ZORPG.State.add("play", {
    name: "Playing",

    init: function() {
        console.log("ZORPG.State.play: Playing state init.");

        // ??? code. An Entity and a Map - THIS IS HACKY
        // Player should be stored somewhere else?(idea: build a singleton containing entities[actors])
        ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
        ZORPG.Player = new ZORPG.Ent("player", ["pos", "actor"]);
        ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
        ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
        ZORPG.Player.actor.name = "SirTaldo";
        ZORPG.Player.actor.hp = 30;

        ZORPG.Canvas.renderMap(ZORPG.Map.getData());




        // Set key handlers
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
            ZORPG.Player.pos.moveFwd()
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyS", function(ev) {
            console.log("down")
            ZORPG.Player.pos.moveBck();
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyA", function(ev) {
            console.log("left")
            ZORPG.Player.pos.rotL()
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyD", function(ev) {
            console.log("right")
            ZORPG.Player.pos.rotR()
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("Space", function(ev) {
            console.log("run script")
            var script = ZORPG.Map.getScript(ZORPG.Player.pos.x, ZORPG.Player.pos.y);

            if (script) {
                ZORPG.State.set("script", {script: script});
            }
        });
    },

    updatePlayer: function() {
        ZORPG.Canvas.updateCamera(ZORPG.Player.pos);
    },

    destroy: function() {
        ZORPG.Key.removeAll();
    }
});





// Refactor this, pronto
ZORPG.State.add("script", {
    name: "script",

    init: function() {
        console.log("ZORPG.State.script: Running script", this.scope.script);

        // Init vars
        var _this = this;
        this.script = this.scope.script.script;
        this.line = 0;

        // Setup handlers
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.removeAll();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("Space", function(ev) {
            _this.next();
        });

        // Run first line
        this.next()
    },

    next: function() {
        if (this.line < this.script.length) {
            console.log("ZORPG.State.script: Running script line", this.line, this.script[this.line]);
            this.line++;
        } else { // Script ended
            ZORPG.Key.removeAll();
            ZORPG.State.set("play");
        }
    },

    destroy: function() {}
});