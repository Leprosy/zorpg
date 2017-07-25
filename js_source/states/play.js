/**
 *  Play loop state
 */
Game.playState = {
    map: null,
    party: null,
    cursors: null,

    preload: function() {
        Engine.load.tilemap("map", "maps/map1.json", null, Phaser.Tilemap.TILED_JSON);
    },
    create: function() {
        console.info(Game.name + " play state", Game);
        var _this = this;

        // Create gameplay objects
        this.map = new Game.Map();
        this.party = new Game.Party();
        this.inter = new Game.Interpreter();
        this.currentScript = null;

        // Input
        Engine.input.keyboard.onDownCallback = function(ev) { _this._inputHandler(ev) };

        //Game.layer.resizeWorld();
    },
    update: function() {
        document.getElementById("debug").value = this.party.x + " - " + this.party.y;
    },


    _inputHandler: function(ev) {
        //console.log("keypressed", ev)

        switch(ev.code) {
            // Party movement
            case "ArrowUp":
                this.party.moveForward(this.map)
                this.currentScript = this.map.getScript(this.party.x, this.party.y);

                // immediate scripts
                if (this.currentScript && this.currentScript.properties.startOnEnter) {
                    this.inter.run(this.currentScript);
                }

                break;
            case "ArrowDown":
                this.party.getBack();
                //Copy logic from forward case
                break;
            case "ArrowLeft":
                this.party.rotateLeft();
                break;
            case "ArrowRight":
                this.party.rotateRight();
                break;

            // Fire map tile action script
            case "Space":
                if (this.currentScript) { // TODO: should run startOnEnter scripts?
                    this.inter.run(this.currentScript);
                }
                break;

            // Exit
            case "Escape":
                Engine.state.start("main");
                break;
        }
    }
}
