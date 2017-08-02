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


// Shows static messages to the player
Game.Interpreter.prototype.show = function(args) {
    this.state.message.show(args);
}
Game.Interpreter.prototype.showDialog = function(args) {
    this.state.message.showDialog(args.name, args.face, args.msg);
}

// Gives a specific amount of gold to the party
Game.Interpreter.prototype.giveGold = function(args) {
    this.state.party.gold += args;
    this.state.message.show("Party found " + args + " Gold");
}

// Change map
Game.Interpreter.prototype.changeMap = function(args) {
    this.state.map.load(args.map);
    this.state.party.setPosition(args.x, args.y);     // Need a way to set the position of player?
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

// Ifs: Tests for several conditions, if true goes to first line, if false, to the second.
// If party have a quest/award
Game.Interpreter.prototype.ifQuest = function(args) {
    this._ifGoto(this.state.party.hasQuest(args.questId), args);
}
Game.Interpreter.prototype.ifAward = function(args) {
    this._ifGoto(this.state.party.hasAward(args.awardId), args);
}
// If party confirms
Game.Interpreter.prototype.ifConfirm = function(args) {
    // May be it's hacky...but I find this hilarious, so I put it here anyway XD 
    if (this.state.message.lastConfirm === null) {
        this.state.message.showConfirm(args.msg);
        this.linePointer--;
    } else {
        this._ifGoto(this.state.message.lastConfirm, args);
        this.state.message.lastConfirm = null;
    }
}
// If goto method
Game.Interpreter.prototype._ifGoto = function(condition, args) {
    if (condition) {
        console.log("Game.Interpreter: Condition is true");
        this.linePointer = args.onTrue - 1;
    } else {
        console.log("Game.Interpreter: Condition is false");
        this.linePointer = args.onFalse - 1;
    }

    console.log("Game.Interpreter: Going to line", this.linePointer + 1);
}

//Exit the script
Game.Interpreter.prototype.exit = function(args) {
    this.endScript();
}
