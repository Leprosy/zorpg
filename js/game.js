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
        Engine.input.keyboard.onDownCallback = function(ev) {
            _this._inputHandler(ev);
        };
    },
    update: function() {
        switch (this.gameStatus) {
          // SCRIPT MODE: Continue running the current script, if any
            case Game.SCRIPT:
            this.interpreter.run();
            break;

          // COMBAT MODE: Continue running the combat turns
            case Game.FIGHTING:
            if (!this.combat.get()) {
                // Start combat round if not already started
                this.combat.next();
            }
            if (!this.combat.isHuman()) {
                // If monster next, attack, else, leave control to player
                this.combat.attack();
                this.combat.next();
            }
            break;
        }
        // Missiles(spells, arrows)????
        // Always: Update HUD
        document.getElementById("debug").innerHTML = "[Pos]:" + this.party.x + "," + this.party.y + " [gameStatus]:" + this.gameStatus + "\n" + this.party + "\n" + "[FIGHTING]\n" + this.combat;
    },
    /**
     * Input handler. This derives the key event to the correct handler (this.gameStatus points it)
     */
    _inputHandler: function(ev) {
        console.log("PlayState: key pressed", ev);
        switch (this.gameStatus) {
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
        switch (ev.code) {
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
        switch (ev.code) {
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
 * Combat queue class. Methods to manage the combat system
 * 
 * each turn, the combatants queue is iterated, until each combatant does an action
 * then, it's reset
 */
Game.Combat = function() {
    this.init();
};

Game.Combat.prototype.init = function() {
    this.monsters = [];
    this.queue = [];
    this.index = -1;
    this.target = 0;
};

// Current index queue fighter attacks
Game.Combat.prototype.attack = function() {
    var attacker = this.queue[this.index];
    var party = Game.playState.party;
    if (!this.isHuman()) {
        // it's a monster, attack a character
        // Damage someone on the party
        Game.Log("Monster " + attacker + " attacks");
        console.log("Game.Combat: monster attacks", attacker);
        party.damageN(1, attacker.hitDie);
    } else {
        // it's a character, attacks target monster
        Game.Log("Character " + attacker + " attacks");
        console.log("Game.Combat: character attacks", attacker);
        var damage = Game.Utils.die(attacker.hitDie);
        var target = this.monsters[this.target];
        target.hp -= damage;
        // Killed?
        if (target.hp <= 0) {
            this.monsters.splice(this.target, 1);
        }
        // All killed?
        if (this.monsters.length === 0) {
            this.init();
            Game.playState.gameStatus = Game.PLAYING;
        }
    }
};

// Adds a monster to the melee group(3 max)
Game.Combat.prototype.add = function(monster) {
    if (this.monsters.length < 3 && this.monsters.indexOf(monster) < 0) {
        this.monsters.push(monster);
        return true;
    } else {
        return false;
    }
};

//Returns current combatant
Game.Combat.prototype.get = function() {
    return this.queue[this.index];
};

//True if current fighter is human
Game.Combat.prototype.isHuman = function() {
    return !(this.get() instanceof Game.Monster);
};

//Returns targeted monster
Game.Combat.prototype.getTarget = function() {
    if (this.target < 0 || this.target >= this.monsters.length) {
        this.target = 0;
    }
    if (this.monsters.length > 0) {
        return this.monsters[this.target];
    }
    return false;
};

// Go next in the queue
Game.Combat.prototype.next = function() {
    if (this.index === -1) {
        this.reset();
    }
    this.index++;
    console.log("Game.Combat: Advancing queue", this.index);
    console.log("Game.Combat: " + this.get() + " turn...");
    Game.Log(this.get() + " turn...");
    if (this.index >= this.queue.length) {
        console.log("Game.Combat: End of queue, round needs reset");
        this.index = -1;
        this.next();
    }
};

// Reset the combat queue
Game.Combat.prototype.reset = function() {
    console.log("Game.Combat: Starting combat round");
    this.index = -1;
    this.queue = [];
    var chars = Game.playState.party.characters;
    // Order combat queue by speed.
    for (i in this.monsters) {
        this.queue.push(this.monsters[i]);
    }
    for (i in chars) {
        // if able to fight...
        if (chars[i].hp > 0) {
            this.queue.push(chars[i]);
        }
    }
    this.queue.sort(function compare(a, b) {
        // Sorting by speed, desc
        if (a.speed < b.speed) {
            return 1;
        }
        if (a.speed > b.speed) {
            return -1;
        }
        return 0;
    });
};

Game.Combat.prototype.toString = function() {
    return this.queue.join("\n");
};

/**
 * Utils & Helpers
 */
Game.Log = function(str, opt) {
    $("#console").append("[" + new Date().toString().split(" ")[4] + "] " + str + "\n");
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

// Gives a specific amount of gold to the party
Game.Interpreter.prototype.giveGold = function(args) {
    this.state.party.gold += args;
    this.state.message.show("Party found " + args + " Gold");
};

// Change map
Game.Interpreter.prototype.changeMap = function(args) {
    this.state.map.load(args.map);
    this.state.party.setPosition(args.x, args.y);
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

//Exit the script
Game.Interpreter.prototype.exit = function(args) {
    this.endScript();
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
    this.group = Engine.add.group();
    this.group.z = 0;
    this.obj = null;
    this.script = {};
    this.properties = {};
    // Load default first map
    this.load("map1");
};

// Load map
Game.Map.prototype.load = function(key) {
    // Remove old map
    this.group.removeAll();
    // Create new one
    this.obj = Engine.add.tilemap(key, Game.tileSize, Game.tileSize);
    this.obj.addTilesetImage("floor", "floorTileset");
    this.obj.addTilesetImage("object", "objectTileset");
    var floor = this.obj.createLayer("floor");
    var object = this.obj.createLayer("object");
    floor.resizeWorld();
    this.group.add(floor);
    this.group.add(object);
    this.script = JSON.parse(this.obj.properties.script);
    this.properties = this.obj.properties;
};

// Get tile info from a x-y position
Game.Map.prototype.getTile = function(x, y) {
    return {
        x: x,
        y: y,
        floor: this.obj.getTile(x, y, "floor"),
        object: this.obj.getTile(x, y, "object")
    };
};

// Get the damage tile inflicts in party(object + floor)
Game.Map.prototype.getTileDamage = function(x, y) {
    var dices = [];
    var floor = this.obj.getTile(x, y, "floor"), object = this.obj.getTile(x, y, "object");
    if (floor && floor.properties.damage) {
        dices.push(floor.properties.damage);
    }
    if (object && object.properties.damage) {
        dices.push(object.properties.damage);
    }
    return dices;
};

// Get tile script, if any
Game.Map.prototype.getScript = function(x, y) {
    if (typeof this.script[x + "x" + y] !== "undefined") {
        return this.script[x + "x" + y];
    } else {
        return false;
    }
};

/**
 * Positioned objects in the map(Monsters, Party, etc)
 */
Game.MapObject = function() {
    // Setup the phaser object and some metadata
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(.5, .5);
    this.x = 0;
    this.y = 0;
    this.speed = 1;
    this.obj.z = 100;
    this.d_angle = Math.PI / 2;
    this.d_dist = Game.tileSize;
};

//Movement methods
Game.MapObject.prototype.moveForward = function() {
    var pos = this.getForward();
    this.doMove(pos);
};

Game.MapObject.prototype.moveBackward = function() {
    var pos = this.getBack();
    this.doMove(pos);
};

Game.MapObject.prototype.doMove = function(pos) {
    var map = Game.playState.map;
    var tileInfo = map.getTile(pos.x, pos.y);
    console.log("Game.MapObject: Checking forward position", tileInfo);
    if (this.canPass(tileInfo)) {
        this.setPosition(pos.x, pos.y);
    } else {
        console.log("Game.MapObject: Can't pass");
    }
};

Game.MapObject.prototype.getForward = function() {
    var x = this.obj.x + this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y + this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
};

Game.MapObject.prototype.getBack = function() {
    var x = this.obj.x - this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y - this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
};

Game.MapObject.prototype.rotateLeft = function() {
    this.obj.rotation = (this.obj.rotation - this.d_angle) % (Math.PI * 2);
};

Game.MapObject.prototype.rotateRight = function() {
    this.obj.rotation = (this.obj.rotation + this.d_angle) % (Math.PI * 2);
};

// Check two mapobjs on the same position
Game.MapObject.prototype.samePos = function(mapObj) {
    return mapObj.x === this.x && mapObj.y === this.y;
};

// Checks if the tile is passable/exists(needs to be extended to include Party/Monsters exclusive rules
Game.MapObject.prototype.canPass = function(tile) {
    // Meant to be used with Game.Map.getTile() method
    if (!tile.floor) return false;
    return !tile.floor.properties.block && (!tile.object || !tile.object.properties.block);
};

// Change object position in the current world map
Game.MapObject.prototype.setPosition = function(x, y) {
    console.log("Game.MapObject setPosition of", this, "to", x, y);
    this.x = x;
    this.y = y;
    // Do the math
    this.obj.x = x * Game.tileSize + Game.tileSize / 2;
    this.obj.y = y * Game.tileSize + Game.tileSize / 2;
};

/**
 * Monster class. Baddies >D
 */
Game.Monster = function() {
    Game.MapObject.call(this);
    this.obj.tint = Math.random() * 16777215;
    // Monster attributes
    this.name = "Bad demon";
    this.hp = 100;
    this.xp = 20;
    this.hitDie = "1d6";
    this.gold = 10;
    this.setPosition(Game.Utils.die("1d10"), Game.Utils.die("1d10"));
};

Game.Monster.prototype = Object.create(Game.MapObject.prototype);

Game.Monster.prototype.constructor = Game.Monster;

// Basic seek algorithm
Game.Monster.prototype.seekParty = function() {
    var party = Game.playState.party;
    console.log("Game.Monster: checking", "monster", this.x, this.y, "party", party.x, party.y);
    // If not near, forget it
    if (Math.abs(party.x - this.x) <= 3 && Math.abs(party.y - this.y) <= 3) {
        // Backup coords.
        var oldX = this.x;
        var oldY = this.y;
        // If angle is horizontal, try to match vertical coordinate first, and viceversa
        var first = "x", second = "y";
        if (party.obj.angle === 0 || party.obj.angle === -180) {
            first = "y";
            second = "x";
        }
        // Try to match first coordinate, then the second one
        if (party[first] > this[first]) {
            this[first]++;
        } else if (party[first] < this[first]) {
            this[first]--;
        } else {
            if (party[second] > this[second]) {
                this[second]++;
            } else if (party[second] < this[second]) {
                this[second]--;
            }
        }
        // TAG...if monster reachs party, push to the queue.
        if (this.samePos(party)) {
            if (Game.playState.combat.add(this)) {
                console.log("Game.Monster: Monster added to combat queue", this);
                Game.playState.gameStatus = Game.FIGHTING;
                this.setPosition(this.x, this.y);
            } else {
                this.x = oldX;
                this.y = oldY;
            }
        } else {
            this.setPosition(this.x, this.y);
        }
    }
};

Game.Monster.prototype.toString = function() {
    return this.name + "(hp:" + this.hp + "-spd:" + this.speed + ")";
};

/**
 * Party class. This represents the player party in the game.
 *
 */
Game.Party = function() {
    Game.MapObject.call(this);
    // Party attributes and stats
    this.gold = 2e3;
    this.gems = 50;
    this.quests = {};
    this.awards = {};
    // debug start party
    this.characters = [ new Game.Character("Sir Lepro"), new Game.Character("Lady Aindir"), new Game.Character("Edward the cat") ];
    this.characters[0].speed = 12;
    this.characters[1].speed = 10;
    this.characters[2].speed = 20;
    Engine.camera.follow(this.obj);
};

Game.Party.prototype = Object.create(Game.MapObject.prototype);

Game.Party.prototype.constructor = Game.Party;

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

// Damage a random number of party members, for a die of damage
Game.Party.prototype.damageN = function(number, dieString) {
    var damage = Game.Utils.die(dieString);
    var charIndex = Game.Utils.die("1d" + (this.characters.length - 1));
    for (i = 0; i < number; ++i) {
        this.damageChar(this.characters[charIndex], damage);
    }
};

// Damage all
Game.Party.prototype.damageAll = function(dieString) {
    var damage = Game.Utils.die(dieString);
    for (i = 0; i < this.characters.length; ++i) {
        this.damageChar(this.characters[i], damage);
    }
};

Game.Party.prototype.damageChar = function(char, damage) {
    Game.Log(char + " received " + damage + " damage!");
    console.log("Game.Party: Damaging " + char + " for " + damage);
    char.hp -= damage;
    Game.Utils.damage(damage);
};

// Set position extension for Party - calculates tile damage
Game.Party.prototype.setPostiion = function(setPosition) {
    Game.Party.prototype.setPosition = function(x, y) {
        setPosition.call(this, x, y);
        // Run parent method
        // Extending code - check tile damage for party
        console.log("Game.Party setPosition");
        var map = Game.playState.map;
        var damageDices = map.getTileDamage(x, y);
        for (i in damageDices) {
            this.damageAll(damageDices[i]);
        }
    };
}(Game.Party.prototype.setPosition);

// Party object debug string form
Game.Party.prototype.toString = function() {
    // debug
    var txt = "[PartyInfo] Gold: " + this.gold + " Gems: " + this.gems + "\n[CHARS]";
    for (i = 0; i < this.characters.length; ++i) {
        txt += this.characters[i] + " | ";
    }
    txt += "\n[QUESTS]\n";
    for (i in this.quests) {
        txt += this.quests[i] + "(" + i + ")\n";
    }
    txt += "\n[AwARDS]\n";
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
    this.hp = 30;
    this.hitDie = "1d8";
};

Game.Character.prototype.toString = function() {
    return this.name + "(hp:" + this.hp + "-spd:" + this.speed + ")";
};

/**
 * Messages in the game
 * 
 */
Game.Message = function() {
    this.group = Engine.add.group();
    this.group.fixedToCamera = true;
    this.group.z = 200;
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

// Closes message setting confirm status in case of need. Returns to Script mode
Game.Message.prototype.close = function(key) {
    console.log("Game.Message: closing message, returning to script mode");
    Game.playState.gameStatus = Game.SCRIPT;
    if (this.isConfirm) {
        this.lastConfirm = key === "KeyY";
    } else {
        this.lastConfirm = null;
    }
    this.group.removeAll();
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

// Damage animation
Game.Utils.damage = function(damage) {
    if (damage > 0) {
        Engine.camera.shake(damage / 1e3, 300, true);
        Engine.camera.flash(16711680, 100, true);
        console.log("Game.Utils.damage: Party gets damage for " + damage);
    } else {
        console.log("Game.Utils.damage: Party avoids damage");
    }
};