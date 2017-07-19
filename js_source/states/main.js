// Main menu state
Game.mainState = {
    preload: function() {
        console.info(Game.name + " main menu");
    },

    create: function() {
        // Draw main menu
        Engine.add.text(10, 10, Game.name, {font: "20px Arial", fill: "#ffffff"});
        Engine.add.text(10, 50, "press space to start", {font: "12px Arial", fill: "#ffffff"});

        // Wait for user input
        var key = Engine.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        key.onDown.addOnce(function() { music.stop();Engine.state.start("play") }, this);
    }
}
