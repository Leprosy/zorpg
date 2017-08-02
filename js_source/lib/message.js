/**
 * Messages in the game
 * 
 */
Game.Message = function() {
    this.group = Engine.add.group();
    this.group.fixedToCamera = true;
    this.group.z = 200;
    this.lastConfirm = null;
    this.isConfirm = false;
}

// Init - closing previous message and entering MESSAGE mode
Game.Message.prototype._init = function() {
    console.log("Game.Message: entering message mode")
    Game.playState.gameStatus = Game.MESSAGE;
    this.lastConfirm = null;
    this.isConfirm = false;
}

// Shows a basic message to the player
Game.Message.prototype.show = function(message) {
    this._init();
    this.group.add(Engine.add.text(10, 10, message, {font: "20px Arial", fill: "#ffffff"}));
    this.group.add(Engine.add.text(10, 30, "<press a key>", {font: "20px Arial", fill: "#000000"}));
}
//Shows a dialog message, with an NPC
Game.Message.prototype.showDialog = function(name, face, message) {
    this._init();
    this.group.add(Engine.add.sprite(0, 0, "npcFaces", face));
    this.group.add(Engine.add.text(70, 5, name, {font: "20px Arial", fill: "#ffffff"}));
    this.group.add(Engine.add.text(70, 35, message, {font: "20px Arial", fill: "#ffffff"}));
    this.group.add(Engine.add.text(10, 60, "<press a key>", {font: "20px Arial", fill: "#000000"}));
}

//Shows a confirm message to the player
Game.Message.prototype.showConfirm = function(message) {
    this._init();
    this.isConfirm = true;
    this.group.add(Engine.add.text(10, 10, message, {font: "20px Arial", fill: "#ffffff"}));
    this.group.add(Engine.add.text(10, 30, "<(Y)es or (N)o>", {font: "20px Arial", fill: "#000000"}));
}

// Closes message and reset confirm status
Game.Message.prototype.close = function() {
    this.group.removeAll();
}
