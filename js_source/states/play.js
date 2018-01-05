// Play loop state
ZORPG.State.add("play", {
    name: "Playing",

    init: function() {
        // ??? code. An Entity and a Map - THIS IS HACKY
        // TODO: Player should be stored somewhere else?(idea: build a singleton containing entities[actors])
        // TODO: Add check for create Player/Map/anytghin
        if (typeof ZORPG.Player === "undefined") {
            ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
            ZORPG.Player = new ZORPG.Ent("player", ["pos", "actor"]);
            ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
            ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
            ZORPG.Player.actor.name = "SirTaldo";
            ZORPG.Player.actor.hp = 30;

            ZORPG.Canvas.renderMap(ZORPG.Map.getData());
        }




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

            // Check line
            ZORPG.State.set("message", {title: "TITLE", content: "THIS IS A MESSAGE"});
        } else { // Script ended
            ZORPG.Key.removeAll();
            ZORPG.State.set("play");
        }
    },

    destroy: function() {}
});


ZORPG.State.add("message", {
    name: "message",

    init: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "OK");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.title + ":" + this.scope.content;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;

        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.State.set("play");
        });

        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
    }
})