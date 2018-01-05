// Scripting module
ZORPG.Script = (function() {
    var lineNumber = 0;
    var script = null;
    var properties = null;

    return {
        // Inits a new script
        load: function(data) {
            lineNumber = 0;
            script = data.script;
            properties = data.properties;
        },

        // Runs a line
        run: function() {
            if (!this.isComplete()) {
                console.log("ZORPG.Script: Running line", lineNumber, script[lineNumber]);

                //try {
                var action = script[lineNumber].action;
                var args   = script[lineNumber].args;
                lineNumber++;
                this[action](args);

            } else {
                throw Error("ZORPG.Script: Script already completed.");
            }
        },

        // Check if script has ended
        isComplete: function() {
            return lineNumber >= script.length;
        },


        // SCRIPTING COMMANDS
        ifAward: function(args) {
            // if ZORPG.Player.hasAward(args.awardId) { lineNumber = args.onTrue} else
            lineNumber = args.onFalse;
            this.run();
        },
        ifQuest: function(args) {
            // if ZORPG.Player.hasQuest(args.awardId) { lineNumber = args.onTrue} else
            lineNumber = args.onFalse;
            this.run();
        },
        showDialog: function(args) {
            console.log("SHOWDIALOG", args)
        },
        show: function(args) {
            console.log("SHOW", args)
        },

        // Seriously?
        taldo: function(args) {
            return "oaw";
        }
    }
})();

