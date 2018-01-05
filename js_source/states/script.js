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
            console.log("ZORPG.Script: running line", lineNumber, script[lineNumber]);
            lineNumber++;
        },

        // Ended?
        isComplete: function() {
            return lineNumber >= script.length;
        },

        taldo: function(args) {
            return "oaw";
        }
    }
})();

