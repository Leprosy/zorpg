Game.Interpreter = function() {
    this.script = [];
}

Game.Interpreter.prototype.run = function() {
    var linePointer = 0;
    var script = [{action: "print", args: "hello"},
                  {action: "print", args: "world"},
                  {action: "confirm", args: "Do you like to restart?"}]

    console.log("Game.Interpreter: running", script, this)

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
    
}