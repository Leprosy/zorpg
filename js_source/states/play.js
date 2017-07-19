// Play loop state
Game.playState = {
    preload: function() {
        
    },

    create: function() {
        console.info(Game.name + " play loop");
        console.info("Game params", Game);

        // On esc, restart current map, lose a life. If game over, go back to menu
        var key = Engine.input.keyboard.addKey(Phaser.Keyboard.ESC);
        key.onDown.addOnce(function() { Engine.state.start("main"); });
    },

    update: function() {

    },

    render: function() {
    }
}
