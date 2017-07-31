/**
 *  Play loop state
 */
Game.NONE = 0;
Game.PLAYING = 1;
Game.FIGHTING = 2;
Game.BROWSING = 3;
Game.SCRIPT = 4;
Game.MESSAGE = 10;
Game.DEAD = 666;

Game.playState = {
    preload: function() {
        Engine.load.tilemap("map", "maps/map1.json", null, Phaser.Tilemap.TILED_JSON);
    },
    create: function() {
        console.info(Game.name + " play state", Game);
        var _this = this;

        // Game play attributes
        this.gameStatus = Game.PLAYING;

        // Create gameplay objects
        this.map = new Game.Map();
        this.party = new Game.Party();
        this.interpreter = new Game.Interpreter();
        this.message = new Game.Message();

        // Input
        Engine.input.keyboard.onDownCallback = function(ev) { _this._inputHandler(ev) };

        //Game.layer.resizeWorld();
    },
    update: function() {
        // Run script
        if (this.gameStatus === Game.SCRIPT) {
            this.interpreter.run();
        }

        // Update HUD
        document.getElementById("debug").innerHTML =
            "position:" + this.party.x + " - " + this.party.y + "\n" +
            "gameStatus:" + this.gameStatus + "\n" +
            this.party
    },


    _inputHandler: function(ev) {
        //console.log("keypressed", ev)

        switch(this.gameStatus) {
            case Game.PLAYING:
                this._checkPlayingInput(ev);
                break;
            case Game.MESSAGE:
                // A key was pressed, remove message
                this.gameStatus = Game.SCRIPT;
                this.message.close();
                console.log("PlayState: exit message mode, returning to script mode")
                break;
            default:
                console.error("PlayState: invalid playing state.");
                break;
        }
    },

    _checkPlayingInput: function(ev) {
        switch(ev.code) {
            // Party movement
            case "ArrowUp":
                this.party.moveForward(this.map)
                var scriptData = this.map.getScript(this.party.x, this.party.y);

                if (scriptData) {
                    console.log("PlayState: loaded script", scriptData);
                }

                this.interpreter.load(scriptData.script);

                if (scriptData && scriptData.properties.startOnEnter) {
                    this.gameStatus = Game.SCRIPT;
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
                if (this.interpreter.script) {
                    this.gameStatus = Game.SCRIPT;
                    console.log("PlayState: entering script mode");
                } else {
                    console.log("PlayState: no script");
                }
                break;

            // Exit
            case "Escape":
                console.log("PlayState: return to main state");
                Engine.state.start("main");
                break;
        }
    }
}
