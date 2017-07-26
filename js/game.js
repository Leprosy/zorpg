/**
 * Super fun gamez engine
 */
// Engine namespaces and definitions
var Engine = {};

var Game = {};

Game.name = "_zorpg";

Game.version = "0.1";

Game.width = 640;

Game.height = 640;

Game.tileSize = 32;

Game.taldo = "oaw";

// Load assets state
Game.loadState = {
    preload: function() {
        console.info(Game.name + " loading assets");
        var loadText = Engine.add.text(10, 10, "Loading...", {
            font: "20px Arial",
            fill: "#ffffff"
        });
        loadText.anchor.x = .5;
        loadText.anchor.y = .5;
        Engine.load.spritesheet("floorTileset", "img/floor.png", Game.tileSize, Game.tileSize);
        Engine.load.spritesheet("objectTileset", "img/object.png", Game.tileSize, Game.tileSize);
    },
    create: function() {
        Engine.state.start("main");
    }
};

// Main menu state
Game.mainState = {
    preload: function() {
        console.info(Game.name + " main menu");
    },
    create: function() {
        // Draw main menu
        Engine.add.text(10, 10, Game.name, {
            font: "20px Arial",
            fill: "#ffffff"
        });
        Engine.add.text(10, 50, "press space to start", {
            font: "12px Arial",
            fill: "#ffffff"
        });
        // Wait for user input
        var key = Engine.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        key.onDown.addOnce(function() {
            Engine.state.start("play");
        }, this);
    }
};

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
        Engine.input.keyboard.onDownCallback = function(ev) {
            _this._inputHandler(ev);
        };
    },
    update: function() {
        // Run script
        if (this.gameStatus === Game.SCRIPT) {
            this.interpreter.run();
        }
        // Update HUD
        document.getElementById("debug").innerHTML = "position:" + this.party.x + " - " + this.party.y + "\n" + "gameStatus:" + this.gameStatus + "\n" + "gold:" + this.party.gold;
    },
    _inputHandler: function(ev) {
        //console.log("keypressed", ev)
        switch (this.gameStatus) {
          case Game.PLAYING:
            this._checkPlayingInput(ev);
            break;

          case Game.MESSAGE:
            // A key was pressed, remove message
            this.gameStatus = Game.SCRIPT;
            this.message.close();
            console.log("PlayState: exit message mode, returning to script mode");
            break;

          default:
            console.error("PlayState: invalid playing state.");
            break;
        }
    },
    _checkPlayingInput: function(ev) {
        switch (ev.code) {
          // Party movement
            case "ArrowUp":
            this.party.moveForward(this.map);
            this.interpreter.load(this.map.getScript(this.party.x, this.party.y).script);
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
            this.gameStatus = Game.SCRIPT;
            console.log("PlayState: entering script mode");
            break;

          // Exit
            case "Escape":
            console.log("PlayState: return to main state");
            Engine.state.start("main");
            break;
        }
    }
};

Game.Message = function() {
    this.group = Engine.add.group();
};

Game.Message.prototype.show = function(title, message) {
    this.close();
    this.group.add(Engine.add.text(10, 10, title, {
        font: "20px Arial",
        fill: "#ffffff"
    }));
    this.group.add(Engine.add.text(10, 30, message, {
        font: "20px Arial",
        fill: "#ffffff"
    }));
    this.group.add(Engine.add.text(10, 60, "<press a key>", {
        font: "20px Arial",
        fill: "#000000"
    }));
};

Game.Message.prototype.close = function() {
    this.group.removeAll();
};

// Setting up main states
Engine = new Phaser.Game({
    //enableDebug: false,
    width: Game.width,
    height: Game.height,
    renderer: Phaser.AUTO,
    antialias: false,
    //transparent: true,
    parent: "game"
});

// States defined
Engine.state.add("load", Game.loadState);

Engine.state.add("main", Game.mainState);

Engine.state.add("play", Game.playState);

// Let's roll
window.onload = function() {
    console.info(Game.name + " init");
    Engine.state.start("load");
};

/**
 * Interpreter class. This execute map scripting, using play state to modify
 * game objects.
 */
Game.Interpreter = function() {
    this.script = [];
    this.linePointer = 0;
    this.state = Engine.state.getCurrentState();
};

// Loads a script into the interpreter
Game.Interpreter.prototype.load = function(script) {
    this.script = script;
    this.linePointer = 0;
};

// Runs the current line of script
Game.Interpreter.prototype.run = function() {
    // End script and return to play mode
    // TODO: This only works if script is repeatable
    if (this.linePointer >= this.script.length) {
        this.linePointer = 0;
        this.state.gameStatus = Game.PLAYING;
        console.log("Game.Interpreter: ending script & restarting");
        return;
    }
    if (this.state.gameStatus === Game.SCRIPT) {
        var line = this.script[this.linePointer];
        console.info("Game.Interpreter: running line", this.linePointer, line);
        if (!this.__proto__.hasOwnProperty(line.action)) {
            console.error("Game.Interpreter: invalid line", this.linePointer, line);
            return;
        }
        this[line.action](line.args);
        this.linePointer++;
    }
};

// Shows a message to the player
Game.Interpreter.prototype.print = function(args) {
    this.state.gameStatus = Game.MESSAGE;
    // on Message object?
    console.log("Game.Interpreter: entering message mode");
    this.state.message.show("Message", args);
};

// Gives a specific gold to the party
Game.Interpreter.prototype.giveGold = function(args) {
    this.state.party.gold += args;
};

/**
 * Map class. Methods to interact with the tile based game maps.
 *
 * Tile properties:
 *
 * block: the tile blocks the player
 * damage: the tile damages the player(using a die string)
 */
Game.Map = function() {
    this.obj = Engine.add.tilemap("map", Game.tileSize, Game.tileSize);
    this.obj.addTilesetImage("floor", "floorTileset");
    this.obj.addTilesetImage("object", "objectTileset");
    this.obj.createLayer("floor");
    this.obj.createLayer("object");
    this.script = JSON.parse(this.obj.properties.script);
};

Game.Map.prototype.getTile = function(x, y) {
    return {
        x: x,
        y: y,
        floor: this.obj.getTile(x, y, "floor"),
        object: this.obj.getTile(x, y, "object")
    };
};

Game.Map.prototype.getScript = function(x, y) {
    if (typeof this.script[x + "x" + y] !== "undefined") {
        return this.script[x + "x" + y];
    } else {
        return false;
    }
};

/**
 * Party class. This represents the player party in the game.
 *
 */
Game.Party = function() {
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(.5, .5);
    this.x = 0;
    this.y = 0;
    this.d_angle = Math.PI / 2;
    this.d_dist = Game.tileSize;
    this.gold = 2e3;
    this.gems = 50;
    this.setPosition(0, 0);
};

Game.Party.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    // Do the math
    this.obj.x = x * Game.tileSize + Game.tileSize / 2;
    this.obj.y = y * Game.tileSize + Game.tileSize / 2;
};

Game.Party.prototype.moveForward = function(map) {
    var pos = this.getForward();
    var tileInfo = map.getTile(pos.x, pos.y);
    console.log("Game.Party: Checking forward position", tileInfo);
    if (this.canPass(tileInfo)) {
        this.setPosition(pos.x, pos.y);
    } else {
        console.log("Game.Party: Party can't pass");
    }
};

Game.Party.prototype.getForward = function() {
    var x = this.obj.x + this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y + this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
};

Game.Party.prototype.getBack = function() {
    var x = this.obj.x - this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y - this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
};

Game.Party.prototype.rotateLeft = function() {
    this.obj.rotation = (this.obj.rotation - this.d_angle) % (Math.PI * 2);
};

Game.Party.prototype.rotateRight = function() {
    this.obj.rotation = (this.obj.rotation + this.d_angle) % (Math.PI * 2);
};

Game.Party.prototype.canPass = function(tile) {
    // Meant to be used with Game.Map.getTile() method
    if (!tile.floor) return false;
    return !tile.floor.properties.block && (!tile.object || !tile.object.properties.block);
};