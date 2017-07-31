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

//Exits script mode, stopping the execution, and returns the pointer to the start
Game.Interpreter.prototype.endScript = function() {
    this.state.gameStatus = Game.PLAYING;
    this.linePointer = 0;
    console.log("Game.Interpreter: ending script & restarting");
}

// Runs the current line of script
Game.Interpreter.prototype.run = function() {
    // End script and return to play mode
    // TODO: This only works if script is repeatable
    if (this.linePointer >= this.script.length) {
        this.endScript();
        return;
    }

    if (this.state.gameStatus === Game.SCRIPT) {
        var line = this.script[this.linePointer];
        console.info("Game.Interpreter: running line", this.linePointer, line);

        if (!this.__proto__.hasOwnProperty(line.action)) {
            console.error("Game.Interpreter: invalid line", this.linePointer, line);
            this.endScript();
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

// Gives a quest
Game.Interpreter.prototype.giveQuest = function(args) {
    if (!this.state.party.hasQuest(args.questId)) {
        this.state.party.giveQuest(args);
    } else {
        console.error("Game.Interpreter: party already has the quest", args);
    }
}
// Gives an award
Game.Interpreter.prototype.giveAward = function(args) {
    if (!this.state.party.hasAward(args.awardId)) {
        this.state.party.giveAward(args);
    } else {
        console.error("Game.Interpreter: party already has the award", args);
    }
}
// Quest completed, remove it
Game.Interpreter.prototype.removeQuest = function(args) {
    if (!this.state.party.hasQuest(args.questId)) {
        this.state.party.removeQuest(args);
    } else {
        console.error("Game.Interpreter: party don't have the quest", args);
    }
}

// Exit the script
Game.Interpreter.prototype.exit = function(args) {
    this.endScript();
}

// If's
// Test for several conditions, if true goes to first line, if false, to the second.
// If party have a quest
Game.Interpreter.prototype.ifQuest = function(args) {
    this._ifGoto(this.state.party.hasQuest(args.questId), args);
}
// If party have an award
Game.Interpreter.prototype.ifAward = function(args) {
    this._ifGoto(this.state.party.hasAward(args.awardId), args);
}
// If goto
Game.Interpreter.prototype._ifGoto = function(condition, args) {
    if (condition) {
        console.log("Game.Interpreter: Condition is true");
        this.linePointer = args.onTrue - 1;
    } else {
        console.log("Game.Interpreter: Condition is false");
        this.linePointer = args.onFalse - 1;
    }
}