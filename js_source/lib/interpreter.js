/**
 * Interpreter class. This execute map scripting, using play state to modify
 * game objects.
 */

Game.Interpreter = function() {
    this.script = [];
    this.linePointer = 0;
    this.state = Engine.state.getCurrentState();
}

// Loads a script into the interpreter
Game.Interpreter.prototype.load = function(script) {
    this.script = script;
    this.linePointer = 0;
}

// Runs the current line of script
Game.Interpreter.prototype.run = function() {
    // End script and return to play mode
    // TODO: This only works if script is repeatable
    if (this.linePointer >= this.script.length) {
        this.linePointer = 0;
        this.state.gameStatus = Game.PLAYING;
        console.log("Game.Interpreter: ending script & restarting");
        return;
    }

    if (this.state.gameStatus === Game.SCRIPT) {
        var line = this.script[this.linePointer];
        console.info("Game.Interpreter: running line", this.linePointer, line);

        if (!this.__proto__.hasOwnProperty(line.action)) {
            console.error("Game.Interpreter: invalid line", this.linePointer, line);
            return;
        }

        this[line.action](line.args);
        this.linePointer++;
    }
}


// Shows a message to the player
Game.Interpreter.prototype.print = function(args) {
    this.state.message.show("Message", args);
}

// Gives a specific gold to the party
Game.Interpreter.prototype.giveGold = function(args) {
    this.state.party.gold += args;
    this.state.message.show("Party found", args + " Gold");
}
