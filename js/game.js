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
        Engine.load.spritesheet("npcFaces", "img/npc.png", 62, 62);
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
        document.getElementById("debug").innerHTML = "position:" + this.party.x + " - " + this.party.y + "\n" + "gameStatus:" + this.gameStatus + "\n" + this.party;
    },
    _inputHandler: function(ev) {
        console.log("keypressed", ev);
        switch (this.gameStatus) {
          case Game.PLAYING:
            this._checkPlayingInput(ev);
            break;

          case Game.MESSAGE:
            // A key was pressed, remove message(if confirm, just accept Y/N)
            if (!this.message.isConfirm || (ev.code === "KeyY" || ev.code === "KeyN")) {
                this.gameStatus = Game.SCRIPT;
                this.message.close();
                this.message.lastConfirm = ev.code === "KeyY";
                console.log("PlayState: exit message mode, returning to script mode");
            }
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

//Exits script mode, stopping the execution, and returns the pointer to the start
Game.Interpreter.prototype.endScript = function() {
    this.state.gameStatus = Game.PLAYING;
    this.linePointer = 0;
    console.log("Game.Interpreter: ending script & restarting");
};

// Runs the current line of script
Game.Interpreter.prototype.run = function() {
    // End script and return to play mode
    // TODO: This only works if script is repeatable
    if (this.linePointer >= this.script.length) {
        this.endScript();
        return;
    }
    if (this.state.gameStatus === Game.SCRIPT) {
        var line = this.script[this.linePointer];
        console.info("Game.Interpreter: running line", this.linePointer, line);
        if (!this.__proto__.hasOwnProperty(line.action)) {
            console.error("Game.Interpreter: invalid line", this.linePointer, line);
            this.endScript();
            return;
        }
        this[line.action](line.args);
        this.linePointer++;
    }
};

// Shows static messages to the player
Game.Interpreter.prototype.show = function(args) {
    this.state.message.show(args);
};

Game.Interpreter.prototype.showDialog = function(args) {
    this.state.message.showDialog(args.name, args.face, args.msg);
};

// Gives a specific gold to the party
Game.Interpreter.prototype.giveGold = function(args) {
    this.state.party.gold += args;
    this.state.message.show("Party found " + args + " Gold");
};

// Gives a quest
Game.Interpreter.prototype.giveQuest = function(args) {
    if (!this.state.party.hasQuest(args.questId)) {
        this.state.party.giveQuest(args);
    } else {
        console.error("Game.Interpreter: party already has the quest", args);
    }
};

// Gives an award
Game.Interpreter.prototype.giveAward = function(args) {
    if (!this.state.party.hasAward(args.awardId)) {
        this.state.party.giveAward(args);
    } else {
        console.error("Game.Interpreter: party already has the award", args);
    }
};

// Quest completed, remove it
Game.Interpreter.prototype.removeQuest = function(args) {
    if (!this.state.party.hasQuest(args.questId)) {
        this.state.party.removeQuest(args);
    } else {
        console.error("Game.Interpreter: party don't have the quest", args);
    }
};

// Exit the script
Game.Interpreter.prototype.exit = function(args) {
    this.endScript();
};

// Ifs: Tests for several conditions, if true goes to first line, if false, to the second.
// If party have a quest/award
Game.Interpreter.prototype.ifQuest = function(args) {
    this._ifGoto(this.state.party.hasQuest(args.questId), args);
};

Game.Interpreter.prototype.ifAward = function(args) {
    this._ifGoto(this.state.party.hasAward(args.awardId), args);
};

// If party confirms
Game.Interpreter.prototype.ifConfirm = function(args) {
    // May be it's hacky...but I find this hilarious, so I put it here anyway XD 
    if (this.state.message.lastConfirm === null) {
        this.state.message.showConfirm(args.msg);
        this.linePointer--;
    } else {
        this._ifGoto(this.state.message.lastConfirm, args);
        this.state.message.lastConfirm = null;
    }
};

// If goto method
Game.Interpreter.prototype._ifGoto = function(condition, args) {
    if (condition) {
        console.log("Game.Interpreter: Condition is true");
        this.linePointer = args.onTrue - 1;
    } else {
        console.log("Game.Interpreter: Condition is false");
        this.linePointer = args.onFalse - 1;
    }
    console.log("Game.Interpreter: Going to line", this.linePointer + 1);
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
    var layer = this.obj.createLayer("floor");
    this.obj.createLayer("object");
    layer.resizeWorld();
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
 * Messages in the game
 * 
 */
Game.Message = function() {
    this.group = Engine.add.group();
    this.group.fixedToCamera = true;
    this.lastConfirm = null;
    this.isConfirm = false;
};

// Init - closing previous message and entering MESSAGE mode
Game.Message.prototype._init = function() {
    console.log("Game.Message: entering message mode");
    Game.playState.gameStatus = Game.MESSAGE;
    this.lastConfirm = null;
    this.isConfirm = false;
};

// Shows a basic message to the player
Game.Message.prototype.show = function(message) {
    this._init();
    this.group.add(Engine.add.text(10, 10, message, {
        font: "20px Arial",
        fill: "#ffffff"
    }));
    this.group.add(Engine.add.text(10, 30, "<press a key>", {
        font: "20px Arial",
        fill: "#000000"
    }));
};

//Shows a dialog message, with an NPC
Game.Message.prototype.showDialog = function(name, face, message) {
    this._init();
    this.group.add(Engine.add.sprite(0, 0, "npcFaces", face));
    this.group.add(Engine.add.text(70, 5, name, {
        font: "20px Arial",
        fill: "#ffffff"
    }));
    this.group.add(Engine.add.text(70, 35, message, {
        font: "20px Arial",
        fill: "#ffffff"
    }));
    this.group.add(Engine.add.text(10, 60, "<press a key>", {
        font: "20px Arial",
        fill: "#000000"
    }));
};

//Shows a confirm message to the player
Game.Message.prototype.showConfirm = function(message) {
    this._init();
    this.isConfirm = true;
    this.group.add(Engine.add.text(10, 10, message, {
        font: "20px Arial",
        fill: "#ffffff"
    }));
    this.group.add(Engine.add.text(10, 30, "<(Y)es or (N)o>", {
        font: "20px Arial",
        fill: "#000000"
    }));
};

// Closes message and reset confirm status
Game.Message.prototype.close = function() {
    this.group.removeAll();
};

/**
 * Party class. This represents the player party in the game.
 *
 */
Game.Party = function() {
    // Setup the phaser object and some metadata
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(.5, .5);
    this.x = 0;
    this.y = 0;
    this.d_angle = Math.PI / 2;
    this.d_dist = Game.tileSize;
    // Party attributes and stats
    this.gold = 2e3;
    this.gems = 50;
    this.quests = {};
    //"quest0001": "Check out the statue on the lava temple."};
    this.awards = {};
    this.characters = [ new Game.Character("Sir Lepro"), new Game.Character("Lady Aindir"), new Game.Character("Edward the cat") ];
    Engine.camera.follow(this.obj);
    // follow the party through the map
    this.setPosition(0, 0);
};

// Party's quest & awards methods. Checks, adds and removes
Game.Party.prototype.hasQuest = function(questId) {
    if (typeof this.quests[questId] !== "undefined") {
        return this.quests[questId];
    } else {
        return false;
    }
};

Game.Party.prototype.hasAward = function(awardId) {
    if (typeof this.awards[awardId] !== "undefined") {
        return this.awards[awardId];
    } else {
        return false;
    }
};

Game.Party.prototype.removeQuest = function(questId) {
    if (typeof this.quests[questId] !== "undefined") {
        delete this.quests[questId];
    } else {
        console.error("Game.Party: Party doesn't have quest.", questId);
    }
};

Game.Party.prototype.giveQuest = function(obj) {
    try {
        this.quests[obj.questId] = obj.desc;
    } catch (e) {
        console.error("Game.Party: Adding invalid quest obj", obj);
    }
};

Game.Party.prototype.giveAward = function(obj) {
    try {
        this.awards[obj.awardId] = obj.desc;
    } catch (e) {
        console.error("Game.Party: Adding invalid award obj", obj);
    }
};

// Sets the party position in the current world map
Game.Party.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    // Do the math
    this.obj.x = x * Game.tileSize + Game.tileSize / 2;
    this.obj.y = y * Game.tileSize + Game.tileSize / 2;
};

// Movement methods
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

// Party object debug string form
Game.Party.prototype.toString = function() {
    // debug
    var txt = "PartyInfo:\nGold: " + this.gold + " Gems: " + this.gems + "\nChars:\n";
    for (i = 0; i < this.characters.length; ++i) {
        txt += this.characters[i] + " | ";
    }
    txt += "\nQuests:\n";
    for (i in this.quests) {
        txt += this.quests[i] + "(" + i + ")\n";
    }
    txt += "\nAwards:\n";
    for (i in this.awards) {
        txt += this.awards[i] + "(" + i + ")\n";
    }
    return txt;
};

/*
 * Character class. Represents a character in the party
 */
Game.Character = function(name) {
    this.name = name;
    this.hp = 100;
};

Game.Character.prototype.toString = function() {
    return this.name + " - " + this.hp;
};

/**
 * Utils & Helpers
 */
Game.Utils = {};

// Parses die notation for random
Game.Utils.die = function(str) {
    try {
        //xdy+z => x dices of y faces, ie (random(y) * x) + z
        var plus = str.split("+");
        var die = plus[0];
        plus = 1 * plus[1] || 0;
        die = die.split("d");
        var factor = 1 * die[0];
        var faces = 1 * die[1];
        return plus + Math.round(Math.random() * faces) * factor;
    } catch (e) {
        console.error("Game.Utils.die: Bad die string", str);
        return false;
    }
};