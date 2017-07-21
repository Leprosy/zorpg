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

// Play loop state
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
        // ESC: go back to menu
        var key = Engine.input.keyboard.addKey(Phaser.Keyboard.ESC);
        key.onDown.addOnce(function() {
            Engine.state.start("main");
        });
        /*
         * Debug code
         */
        /*var I = new Game.Interpreter();
        I.run(); */
        //create map. Dont store on Game in prod!
        this.map = Engine.add.tilemap("map", Game.tileSize, Game.tileSize);
        this.map.addTilesetImage("floor", "floorTileset");
        this.map.addTilesetImage("object", "objectTileset");
        this.map.createLayer("floor");
        this.map.createLayer("object");
        /**
         * End
         */
        // Party
        this.party = new Game.Party();
        // Input
        Engine.input.keyboard.onDownCallback = function(ev) {
            _this._inputHandler(ev);
        };
    },
    update: function() {
        // check input
        document.getElementById("debug").value = this.party.x + " - " + this.party.y;
    },
    render: function() {},
    _inputHandler: function(ev) {
        console.log("keypressed", ev);
        switch (ev.code) {
          case "ArrowUp":
            this.party.moveForward();
            break;

          case "ArrowDown":
            this.party.moveBack();
            break;

          case "ArrowLeft":
            this.party.rotateLeft();
            break;

          case "ArrowRight":
            this.party.rotateRight();
            break;
        }
    }
};

Game.Party = function() {
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(.5, .5);
    this.x = 0;
    this.y = 0;
    this.d_angle = .1;
    // Math.PI / 2
    this.d_dist = 5;
};

Game.Party.prototype.moveForward = function() {
    this.obj.x = this.obj.x + this.d_dist * Math.cos(this.obj.rotation);
    this.obj.y = this.obj.y + this.d_dist * Math.sin(this.obj.rotation);
    this._calculatePos();
};

Game.Party.prototype.moveBack = function() {
    this.obj.x = this.obj.x - this.d_dist * Math.cos(this.obj.rotation);
    this.obj.y = this.obj.y - this.d_dist * Math.sin(this.obj.rotation);
    this._calculatePos();
};

Game.Party.prototype.rotateLeft = function() {
    this.obj.rotation = (this.obj.rotation - this.d_angle) % (Math.PI * 2);
};

Game.Party.prototype.rotateRight = function() {
    this.obj.rotation = (this.obj.rotation + this.d_angle) % (Math.PI * 2);
};

Game.Party.prototype._calculatePos = function() {
    this.x = Math.round(this.obj.x / Game.tileSize);
    this.y = Math.round(this.obj.y / Game.tileSize);
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

Game.Interpreter = function() {
    this.script = [];
};

Game.Interpreter.prototype.run = function() {
    var linePointer = 0;
    var script = [ {
        action: "print",
        args: "hello"
    }, {
        action: "print",
        args: "world"
    }, {
        action: "confirm",
        args: "Do you like to restart?"
    } ];
    console.log("Game.Interpreter: running", script, this);
    while (linePointer < script.length) {
        console.log("Game.Interpreter: line", linePointer);
        var line = script[linePointer];
        if (!this.__proto__.hasOwnProperty(line.action)) {
            console.error("Game.Interpreter: invalid action", line.action, "line", linePointer, line);
            return;
        }
        this[line.action](line.args);
        linePointer++;
    }
};

Game.Interpreter.prototype.print = function(args) {};

Game.Map = function(name) {
    this.name = name;
};

Game.Map.prototype.taldo = function() {};