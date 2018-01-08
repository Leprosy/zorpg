// Script run state
ZORPG.State.add("script", {
    name: "Scripting",

    init: function() {
        // Init vars
        var _this = this;

        // If loading a script...else, keep running the stored one
        if (typeof this.scope !== "undefined" && typeof this.scope.script !== "undefined") {
            console.log("ZORPG.State.script: New script loaded.")
            ZORPG.Script.load(this.scope.script);
        } else {
            console.log("ZORPG.State.script: Current script resumed.")
        }

        // Setup handlers
        /*ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.removeAll();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("Space", function(ev) {
            _this.next();
        }); */

        // Run first line
        this.next()
    },

    next: function() {
        if (!ZORPG.Script.isComplete()) {
            ZORPG.Script.run();
        } else {
            //ZORPG.Key.removeAll();
            ZORPG.State.set("play");
        }
    },

    destroy: function() {}
});
