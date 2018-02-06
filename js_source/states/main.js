// Main menu state.
ZORPG.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        // Build menu GUI
        // TODO: Refactor this in a class/module/obj?
        var splash = new BABYLON.GUI.Image("splash", "img/splash.png");
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click to Start");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.Canvas.GUI.removeControl(splash);
            ZORPG.State.set("play");
        });

        ZORPG.Canvas.GUI.addControl(splash);
        ZORPG.Canvas.GUI.addControl(button1);
    },

    destroy: function() {
        // We will create anything here
        ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
        ZORPG.Monsters.init(); // TODO: This should read data from map or something like that
        ZORPG.Player = new ZORPG.Ent("player", ["pos", "party"]);
        ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
        ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
        ZORPG.Player.party.generateDefaultParty();
        ZORPG.Canvas.renderMap();
    }
});