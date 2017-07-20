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
        console.info(Game.name + " play loop");
        console.info("Game params", Game);
        // On esc, restart current map, lose a life. If game over, go back to menu
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
        // Party
        this.party = Engine.add.sprite(0, 0, "objectTileset", 10);
        this.party.anchor.setTo(.5, .5);
        window.party = this.party;
        this.cursors = Engine.input.keyboard.createCursorKeys();
    },
    update: function() {
        var angle = .1;
        // Math.PI / 2
        var dist = 5;
        // Game.tileSize
        // check input
        if (this.cursors.left.isDown) {
            this.party.rotation = (this.party.rotation - angle) % (Math.PI * 2);
        } else if (this.cursors.right.isDown) {
            this.party.rotation = (this.party.rotation + angle) % (Math.PI * 2);
        }
        if (this.cursors.up.isDown) {
            this.party.x = this.party.x + dist * Math.cos(this.party.rotation);
            this.party.y = this.party.y + dist * Math.sin(this.party.rotation);
        } else if (this.cursors.down.isDown) {
            this.party.x = this.party.x - dist * Math.cos(this.party.rotation);
            this.party.y = this.party.y - dist * Math.sin(this.party.rotation);
        }
    },
    render: function() {}
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