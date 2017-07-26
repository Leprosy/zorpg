/**
 * Interpreter class. This execute map scripting, using play state to modify
 * game objects.
 */

Game.Interpreter = function() {
    this.script = [];
    this.state = Engine.state.getCurrentState();
}

Game.Interpreter.prototype.run = function(script) {
    var linePointer = 0;

    console.log("Game.Interpreter: running", script)

    while (linePointer < script.length) {
        console.log("Game.Interpreter: line", linePointer)
        var line = script[linePointer];

        if (!this.__proto__.hasOwnProperty(line.action)) {
            console.error("Game.Interpreter: invalid action", line.action, "line", linePointer, line);
            return;
        }

        this[line.action](line.args);
        linePointer++;
    }
}



Game.Interpreter.prototype.print = function(args) {
    alert(args);
}

Game.Interpreter.prototype.giveGold = function(args) {
    this.state.party.gold += args;
}