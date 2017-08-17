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
    /**
     * Standard framework methods to preload, create and update state and it's elements
     */
    preload: function() {
        Engine.load.tilemap("map1", "maps/map1.json", null, Phaser.Tilemap.TILED_JSON);
        Engine.load.tilemap("map2", "maps/map2.json", null, Phaser.Tilemap.TILED_JSON);
    },
    create: function() {
        var _this = this;

        // Game play attributes
        this.gameStatus = Game.PLAYING;

        // Create gameplay objects
        this.map = new Game.Map();
        this.interpreter = new Game.Interpreter();
        this.message = new Game.Message();
        this.combat = new Game.Combat();
        this.party = new Game.Party();
        this.party.setPosition(1, 1);

        // TOTALLY DEBUG add  Monsters
        this.monsters = [];
        for (i = 0; i < 1; ++i) {
            this.monsters.push(new Game.Monster());
        }

        // Input handler
        Engine.input.keyboard.onDownCallback = function(ev) { _this._inputHandler(ev) };
    },
    update: function() {
        switch (this.gameStatus) {
            // SCRIPT MODE: Continue running the current script, if any
            case Game.SCRIPT:
                this.interpreter.run();
                break;

            // COMBAT MODE: Continue running the combat turns
            case Game.FIGHTING:
                if (!this.combat.get()) { // Start combat round if not already started
                    this.combat.next();
                }

                if (!this.combat.isHuman()) { // If monster next, attack, else, leave control to player
                    this.combat.attack();
                    this.combat.next();
                }
                break;
        }

        // Missiles(spells, arrows)????

        // Always: Update HUD
        document.getElementById("debug").innerHTML =
            "[Pos]:" + this.party.x + "," + this.party.y + " [gameStatus]:" + this.gameStatus + "\n" +
            this.party + "\n" +
            "[FIGHTING]\n" + this.combat;
    },




    /**
     * Input handler. This derives the key event to the correct handler (this.gameStatus points it)
     */
    _inputHandler: function(ev) {
        console.log("PlayState: key pressed", ev);

        switch(this.gameStatus) {
            case Game.PLAYING:
                this._checkPlayingInput(ev);
                break;

            case Game.FIGHTING:
                this._checkFightingInput(ev);
                //if (this.combat is done) this._checkTurn();
                break;

            case Game.MESSAGE:
                // A key was pressed, remove message(if confirm, just accept Y/N)
                if (!this.message.isConfirm || (ev.code === "KeyY" || ev.code === "KeyN")) {
                    this.message.close(ev.code);
                }
                break;

            default:
                console.error("PlayState: invalid playing state.");
                break;
        }
    },

    // Fighting input check
    _checkFightingInput: function(ev) {
        switch(ev.code) {
            // Party member attacks
            case "KeyA":
                this.combat.attack();
                this.combat.next();
                break;

            // Party member attempts to block
            case "KeyB":
                Game.Log("Blocks!");
            default:
                break;
        }
    },

    // Movement input check
    _checkPlayingInput: function(ev) {
        switch(ev.code) {
            // Party movement back/forth
            case "ArrowUp":
            case "ArrowDown":
                ev.code === "ArrowUp" ? this.party.moveForward() : this.party.moveBackward();

                // Load script. If inmediate, run it.
                var scriptData = this.map.getScript(this.party.x, this.party.y);
                this.interpreter.load(scriptData.script);
                if (scriptData && scriptData.properties.startOnEnter) this.gameStatus = Game.SCRIPT;

                this._checkTurn();
                break;
            case "ArrowLeft":
                this.party.rotateLeft();
                break;
            case "ArrowRight":
                this.party.rotateRight();
                break;

            // Fire map tile action script
            case "Space":
                // Run script, if there is any
                if (this.interpreter.script) {
                    this.gameStatus = Game.SCRIPT;
                    console.log("PlayState: entering script mode");
                } else {
                    console.log("PlayState: no script");
                }

                this._checkTurn();
                break;

            // Exit
            case "Escape":
                console.log("PlayState: return to main state");
                Engine.state.start("main");
                break;
        }
    },




    /**
     * Update turn based events here
     */
    _checkTurn: function() {
        // MONSTERS: Monsters seek the party if they are not engaging it already. Remove dead ones.
        for (i = 0; i < this.monsters.length; ++i) {
            if (this.monsters[i].hp <= 0) {
                this.monsters.splice(i, 1);
            } else {
                if (!this.monsters[i].samePos(this.party)) {
                    this.monsters[i].seekParty();
                }
            }
        }
    }
}
