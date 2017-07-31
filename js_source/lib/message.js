/**
 * Messages in the game
 * 
 */
Game.Message = function() {
    this.group = Engine.add.group();
    this.group.fixedToCamera = true;
}

Game.Message.prototype.show = function(title, message) {
    console.log("Game.Message: entering message mode")
    Game.playState.gameStatus = Game.MESSAGE;
    this.close();
    this.group.add(Engine.add.text(10, 10, title, {font: "20px Arial", fill: "#ffffff"}));
    this.group.add(Engine.add.text(10, 30, message, {font: "20px Arial", fill: "#ffffff"}));
    this.group.add(Engine.add.text(10, 60, "<press a key>", {font: "20px Arial", fill: "#000000"}));
}

Game.Message.prototype.close = function() {
    this.group.removeAll();
}