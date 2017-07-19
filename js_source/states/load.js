// Load assets state
Game.loadState = {
    preload: function() {
        console.info(Game.name + " loading assets");
        var loadText = Engine.add.text(10, 10, "Loading...", {font: "20px Arial", fill: "#ffffff"});
        loadText.anchor.x = 0.5;
        loadText.anchor.y = 0.5;

        /*Engine.load.spritesheet("sprites", "img/sprites.png", Game.tileSize, Game.tileSize);
        Engine.load.spritesheet("tiles", "img/tiles.png", Game.tileSize, Game.tileSize);
        Engine.load.tilemap("map", "maps/map.json", null, Phaser.Tilemap.TILED_JSON);*/

        // SFX
    },

    create: function() {
        Engine.state.start("main");
    }
}
