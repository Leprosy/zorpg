// Scripting module
ZORPG.Script = (function() {
    var lineNumber = 0;
    var script = null;
    var properties = null;
    var lastConfirm = null;

    return {
        // Inits a new script
        load: function(data) {
            lineNumber = 0;
            script = data.script;
            properties = data.properties;
        },

        // Last confirm
        lastConfirm: function() {
            return lastConfirm;
        },
        setConfirm: function(bol) {
            lastConfirm = bol;
        },
        clearConfirm: function() {
            lastConfirm = null;
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
        ifConfirm: function(args) {
            if (lastConfirm === null) {
                lineNumber--; // We will process this command twice
                ZORPG.State.set("message", {mode: "showConfirm", name: "", msg: "COnfirm this"});
            } else {
                if (lastConfirm) {
                    console.log("yes")
                    lineNumber = args.onTrue
                } else {
                    console.log("no")
                    lineNumber = args.onFalse;
                }

                lastConfirm = null;
                this.run();
            }
        },
        ifAward: function(args) {
            if (ZORPG.Player.party.hasAward(args.awardId)) {
                lineNumber = args.onTrue
            } else {
                lineNumber = args.onFalse;
            }

            this.run();
        },
        ifQuest: function(args) {
            if (ZORPG.Player.party.hasQuest(args.questId)) {
                lineNumber = args.onTrue
            } else {
                lineNumber = args.onFalse;
            }

            this.run();
        },

        giveQuest: function(args) {
            console.log("QUEST GIVEN", args);
            ZORPG.Player.party.giveQuest(args);
            this.run();
        },
        giveAward: function(args) {
            console.log("AWARD GIVEN", args);
            ZORPG.Player.party.giveAward(args);
            this.run();
        },
        giveGold: function(args) {
            ZORPG.Player.party.gold += args;
            ZORPG.State.set("message", {mode: "show", msg: "Party found: " + args + " gold"});
        },

        showDialog: function(args) {
            ZORPG.State.set("message", {mode: "showDialog", name: args.name, msg: args.msg});
        },
        show: function(args) {
            ZORPG.State.set("message", {mode: "show", msg: args});
        },

        // Seriously?
        taldo: function(args) {
            return "oaw";
        }
    }
})();

