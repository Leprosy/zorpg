// Main menu state.
ZORPG.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        console.log("ZORPG.State: Main menu.");

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

    destroy: function() {}
});