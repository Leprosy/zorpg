// Play loop state
ZORPG.State.add("play", {
    name: "Playing",

    init: function() {
        console.log("ZORPG.State: Playing.");

        // ??? code. An Entity and a Map
        ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
        ZORPG.Player = new ZORPG.Ent("player", ["pos", "actor"]);
        ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
        ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
        ZORPG.Player.actor.name = "SirTaldo";
        ZORPG.Player.actor.hp = 30;

        ZORPG.Canvas.renderMap(ZORPG.Map.getData());




        // Set key handlers
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.remove("Escape");
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyW", function(ev) {
            console.log("up")
        });
        ZORPG.Key.add("KeyS", function(ev) {
            console.log("down")
        });
        ZORPG.Key.add("KeyA", function(ev) {
            console.log("left")
        });
        ZORPG.Key.add("KeyD", function(ev) {
            console.log("right")
        });
    },

    destroy: function() {}
});