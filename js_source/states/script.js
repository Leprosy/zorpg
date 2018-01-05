// Script run state
ZORPG.State.add("script", {
    name: "Scripting",

    init: function() {
        // Init vars
        var _this = this;

        // If loading a script...else, keep running the stored one
        if (typeof this.scope.script !== "undefined") {
            ZORPG.Script.load(this.scope.script);
        }

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
        if (!ZORPG.Script.isComplete()) {
            ZORPG.Script.run();
        } else {
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
            ZORPG.State.set("script");
        });

        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
    }
})