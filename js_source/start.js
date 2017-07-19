// Setting up main states
Engine = new Phaser.Game({
        //enableDebug: false,
        width: Game.width,
        height: Game.height,
        renderer: Phaser.AUTO,
        antialias: false,
        //transparent: true,
        parent: "game"});

// Use Engine.state.getCurrentState() to get current state object
Engine.state.add("load", Game.loadState);
Engine.state.add("main", Game.mainState);
Engine.state.add("play", Game.playState);

// Let's roll
window.onload = function() {
    console.info(Game.name + " init");
    Engine.state.start("load");
}
