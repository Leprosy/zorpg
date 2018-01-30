var ZORPG = ZORPG || {};

/**
 *  Base ZORPG module...use it to build your own class/package/whatever
 *  
 */
// Demo class
ZORPG.NAMEOFYOURCLASS = function(args) {};

ZORPG.NAMEOFYOURCLASS.prototype.METHOD = function(args) {};

// Demo module
ZORPG.NAMEOFMODULE = function() {
    var PRIVATESTUFF;
    return {
        PUBLICVAR: "content",
        PUBLICMETHOD: function(args) {}
    };
}();

var ZORPG = ZORPG || {};

/**
 *  Canvas module...anything screen related goes here
 *  
 */
ZORPG.Canvas = function() {
    return {
        isUpdating: false,
        tileSize: 10,
        engine: null,
        scene: null,
        camera: null,
        GUI: null,
        speed: 10,
        // Init everything
        init: function() {
            var canvas = document.getElementById("3d");
            this.engine = new BABYLON.Engine(canvas, true);
            this.scene = new BABYLON.Scene(this.engine);
            // Assets loader(is this hacky? call 1-800-IM-B31N6-H4CKY)
            ZORPG.Loader = new BABYLON.AssetsManager(this.scene);
            ZORPG.Loader.onTaskSuccessObservable.add(function(task, event) {
                console.log("ZORPG.Loader: Task succesful", task);
            });
            ZORPG.Loader.onTasksDoneObservable.add(function(a, b, c) {});
            ZORPG.Loader.onProgressObservable.add(function(progress, event) {
                console.log("ZORPG.Loader: Progress", progress);
                ZORPG.Canvas.engine.loadingUIText = "Loading " + progress.remainingCount + "/" + progress.totalCount;
            });
            // Camera
            this.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, this.tileSize * .8, new BABYLON.Vector3(0, 0, 0), this.scene);
            this.camera.attachControl(canvas, true);
            // Light
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = .5;
            // Skybox
            //this.skyBox = this.scene.createDefaultSkybox(new BABYLON.Texture("img/sky1.png", this.scene), true, 10);
            // GUI
            this.GUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            // Rendering loop
            this.engine.runRenderLoop(function() {
                ZORPG.Canvas.scene.render();
            });
        },
        // Clear the 3d canvas
        clear: function() {
            while (this.scene.meshes.length > 0) {
                this.scene.meshes[0].dispose();
            }
        },
        // Render a map
        renderMap: function() {
            var map = ZORPG.Map.getData();
            console.log("ZORPG.Canvas: Rendering map", map);
            // Mats
            var materials = [];
            for (var i = 0; i < 10; ++i) {
                var mat = new BABYLON.StandardMaterial("txt" + i, this.scene);
                mat.diffuseColor = new BABYLON.Color3(i / 10, i / 10, i / 10);
                materials.push(mat);
            }
            var monsterMaterial = new BABYLON.StandardMaterial("txtmon", this.scene);
            monsterMaterial.diffuseColor = new BABYLON.Color3(100, 0, 0);
            var objMaterial = new BABYLON.StandardMaterial("txtobj", this.scene);
            objMaterial.diffuseColor = new BABYLON.Color3(0, 0, 20);
            // Floors & Objects
            for (var y = 0; y < map.floor.length; ++y) {
                for (var x = 0; x < map.floor[y].length; ++x) {
                    var meshf = BABYLON.Mesh.CreateBox("floor" + x + "-" + y, this.tileSize, this.scene);
                    meshf.position.x = x * this.tileSize;
                    meshf.position.z = y * this.tileSize;
                    meshf.position.y = 0;
                    meshf.scaling.y = .1;
                    meshf.material = materials[map.floor[y][x]];
                    if (map.object[y][x] != 0) {
                        var mesho = BABYLON.Mesh.CreateBox("object" + x + "-" + y, this.tileSize / 3, this.scene);
                        mesho.position.x = x * this.tileSize;
                        mesho.position.z = y * this.tileSize;
                        mesho.position.y = this.tileSize / 4;
                        mesho.material = objMaterial;
                    }
                }
            }
            // Monsters
            var _this = this;
            ZORPG.Monsters.each(function(monster, i) {
                var mesh = BABYLON.MeshBuilder.CreateSphere("monster" + i, {
                    diameter: _this.tileSize * .4
                }, _this.scene);
                mesh.position = new BABYLON.Vector3(monster.pos.x * _this.tileSize, _this.tileSize / 4, monster.pos.y * _this.tileSize);
                mesh.material = monsterMaterial;
            });
            // Put camera/player
            this.camera.target.x = map.properties.startX * this.tileSize;
            this.camera.target.z = map.properties.startY * this.tileSize;
            this.camera.target.y = this.tileSize / 4;
            this.camera.beta = Math.PI / 2;
        },
        // Updates canvas objects; positions, etc.
        update: function(call) {
            // Party
            var player = ZORPG.Player.pos;
            var _this = this;
            var turnSpent = player.ang === this.camera.rotation.y;
            // TODO: IS THIS USEFUL?
            this.isUpdating = true;
            // Useful while debugging: reset camera rotation & y-axis position
            this.camera.beta = Math.PI / 2;
            this.camera.position.y = this.tileSize / 4;
            // Set animation and run
            var aniRot = new BABYLON.Animation("rotate", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniX = new BABYLON.Animation("move", "target.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniZ = new BABYLON.Animation("move", "target.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            aniX.setKeys([ {
                frame: 0,
                value: this.camera.target.x
            }, {
                frame: this.speed / 2,
                value: player.x * this.tileSize
            } ]);
            aniZ.setKeys([ {
                frame: 0,
                value: this.camera.target.z
            }, {
                frame: this.speed / 2,
                value: player.y * this.tileSize
            } ]);
            aniRot.setKeys([ {
                frame: 0,
                value: this.camera.alpha
            }, {
                frame: this.speed / 2,
                value: -player.ang - Math.PI / 2
            } ]);
            // Little correction
            this.camera.animations.push(aniX);
            this.camera.animations.push(aniZ);
            this.camera.animations.push(aniRot);
            this.scene.beginAnimation(this.camera, 0, this.speed, false, 1, function() {
                _this.isUpdating = false;
                //EVENTPLZ <- ????
                _this.camera.animations = [];
                // Update rest of the world after player animation ends.
                // Monsters (TODO: animated translation)
                ZORPG.Monsters.each(function(monster, i) {
                    var mesh = ZORPG.Canvas.scene.getMeshByID("monster" + i);
                    if (monster.actor.isAlive()) {
                        mesh.position.x = monster.pos.x * _this.tileSize;
                        mesh.position.z = monster.pos.y * _this.tileSize;
                    } else {
                        // TODO: dispose? change model to a corpse?
                        mesh.position.y = _this.tileSize * .05;
                        mesh.scaling.y = .1;
                    }
                });
                // HUD
                _this.updateChars();
                // After everything is done, callback
                if (typeof call === "function") {
                    call();
                }
            });
        },
        // Update roster
        updateChars: function() {
            $("#roster").html("");
            for (var i = 0; i < ZORPG.Player.party.actors.length; ++i) {
                var char = ZORPG.Player.party.actors[i];
                var div = $('<div id="character' + i + '">');
                div.addClass("col-md-4");
                div.html(char.actor.toString());
                $("#roster").append(div);
            }
        },
        // Higlight a character
        highlightChar: function(ent) {
            $("#roster div").css("border", "none");
            if (typeof ent !== "undefined") {
                $("#roster div#" + ent.name).css("border", "2px solid red");
            }
        },
        // Set the different states HUDs/GUIs
        setHUD: function(hud, data) {
            switch (hud) {
              case "play":
                $("#side").html("<h5>-play hud-</h5>");
                break;

              case "combat":
                $("#side").html("<h5>-combat hud-</h5>");
                for (var i = 0; i < data.monsters.length; ++i) {
                    if (data.monsters[i].hasCmp("monster")) {
                        $("#side").append('<li id="monster' + i + '">' + data.monsters[i].actor + "</li>");
                    }
                }
                break;
            }
        },
        // Shakes the camera
        shake: function(str, call) {
            var speed = 10;
            var str = str || .25;
            var steps = 6;
            var alpha = this.camera.alpha;
            var beta = this.camera.beta;
            var ani1 = new BABYLON.Animation("rotate", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var ani2 = new BABYLON.Animation("rotate", "beta", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var keys = [ {
                frame: 0,
                value: alpha
            } ];
            for (var i = 1; i < steps; ++i) {
                keys.push({
                    frame: i * speed / steps,
                    value: alpha + (Math.random() * str - str / 2)
                });
            }
            keys.push({
                frame: speed,
                value: alpha
            });
            ani1.setKeys(keys);
            keys = [ {
                frame: 0,
                value: beta
            } ];
            for (var i = 1; i < steps; ++i) {
                keys.push({
                    frame: i * speed / steps,
                    value: beta + (Math.random() * str - str / 2)
                });
            }
            keys.push({
                frame: speed,
                value: beta
            });
            ani2.setKeys(keys);
            this.camera.animations.push(ani1);
            this.camera.animations.push(ani2);
            this.scene.beginAnimation(this.camera, 0, speed, false, 1, function() {
                console.log("end shake!");
            });
        }
    };
}();

var ZORPG = ZORPG || {};

/**
 *  Base entity class
 *  
 *  id: unique id of the ent
 *  name: optional name for the ent
 *  tags: list of tags for this ent
 *  data: Placeholder for user data
 *  group: the ent group that holds this ent, if any
 */
ZORPG.Ent = function(name, cmp) {
    // Setup
    this.id = new Date().getTime().toString(16);
    this.name = name;
    this.tags = [];
    // Add components, if any
    if (ZORPG.Utils.isArray(cmp)) {
        for (var i = 0; i < cmp.length; ++i) {
            this.addCmp(cmp[i]);
        }
    }
    // Chain API
    return this;
};

// Adds a component to the entity
ZORPG.Ent.prototype.addCmp = function(key) {
    if (ZORPG.Components.hasOwnProperty(key)) {
        this[key] = Object.assign({}, ZORPG.Components[key]);
        return this;
    } else {
        throw Error("ZORPG.Ent: Component '" + key + "' not found");
    }
};

// Removes a component to the entity
ZORPG.Ent.prototype.removeCmp = function(key) {
    delete this[key];
    return this;
};

// Adds a tag to the entity
ZORPG.Ent.prototype.addTag = function(tag) {
    this.tags.push(tag);
    return this;
};

// Removes a tag to the entity
ZORPG.Ent.prototype.removeTag = function(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    return this;
};

// Tests
ZORPG.Ent.prototype.hasTag = function(tag) {
    return this.tags.indexOf(tag) > -1;
};

ZORPG.Ent.prototype.hasAllTags = function(tagList) {
    for (var i = 0; i < tagList.length; ++i) {
        if (!this.hasTag(tagList[i])) {
            return false;
        }
    }
    return true;
};

ZORPG.Ent.prototype.hasCmp = function(cmp) {
    return this.hasOwnProperty(cmp);
};

ZORPG.Ent.prototype.hasAllCmp = function(cmpList) {
    for (var i in cmpList) {
        if (!this.hasCmp(cmpList[i])) {
            return false;
        }
    }
    return true;
};

/**
 *  Entity group class
 *  
 *  ents: list of entities that this group holds
 */
ZORPG.EntGroup = function() {
    this.ents = [];
};

// Adds an entity to the list
ZORPG.EntGroup.prototype.add = function(ent) {
    this.ents.push(ent);
};

// Removes
ZORPG.EntGroup.prototype.remove = function(ent) {};

// Queries
ZORPG.EntGroup.prototype.queryTags = function(tagList, fn) {};

ZORPG.EntGroup.prototype.queryCmp = function(cmpList) {};

/**
 * Base components
 */
ZORPG.Components = {};

var ZORPG = ZORPG || {};

/**
 *  Keyboard module
 */
ZORPG.Key = function() {
    var keys = {};
    var pre = null;
    var post = null;
    var listener = function(event) {
        console.log("ZORPG.Key: Event fired.", event);
        if (keys.hasOwnProperty(event.code)) {
            // Pre call
            if (typeof pre === "function") {
                console.log("ZORPG.Key: Pre-call method.");
                var result = pre(event);
                if (!result) {
                    console.log("ZORPG.Key: Handler aborted by the pre-call method.");
                    return;
                }
            }
            // Run registered key handlers
            console.log("ZORPG.Key: Registered key pressed", event);
            keys[event.code]();
            // Post call
            if (typeof post === "function") {
                console.log("ZORPG.Key: Post-call method.");
                post(event);
            }
        }
    };
    return {
        setPre: function(f) {
            pre = f;
        },
        setPost: function(f) {
            post = f;
        },
        // Adds a key handler to the register
        add: function(code, handler) {
            if (typeof handler !== "function") {
                throw Error("ZORPG.Key: Invalid listener function provided.");
            }
            if (ZORPG.Utils.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                console.log("ZORPG.Key: Listener registered. Adding the key too.", code);
            } else {
                console.log("ZORPG.Key: Already registered the listener, just adding the key.", code);
            }
            keys[code] = handler;
        },
        // Remove key handlers
        remove: function(code) {
            console.log("ZORPG.Key: Removing handler", code);
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];
                if (ZORPG.Utils.isEmptyObj(keys)) {
                    console.log("ZORPG.Key: No more handlers, removing listener.");
                    document.removeEventListener("keydown", listener);
                }
            } else {
                throw Error("ZORPG.Key: Code doesn't have an event attached.", code);
            }
        },
        removeAll: function() {
            this.setPre(null);
            this.setPost(null);
            for (var key in keys) {
                this.remove(key);
            }
        }
    };
}();

var ZORPG = ZORPG || {};

/**
 *  Map class
 *  
 *  name: unique name of the map
 */
ZORPG.Map = function() {
    var mapData = {};
    return {
        // Clear old map data
        clear: function() {
            mapData = {
                floor: [],
                ceiling: [],
                object: [],
                walls: [],
                properties: {},
                script: {}
            };
        },
        // DEBUG only, delete this asap - Get the data dict
        getData: function() {
            return mapData;
        },
        // Loads a new map
        load: function(data) {
            console.log("ZORPG.Map: Loading and parsing", data);
            this.clear();
            // Parse tile data
            for (var i = 0; i < data.layers.length; ++i) {
                var layer = data.layers[i];
                for (var j = 0; j < layer.height; ++j) {
                    var row = [];
                    for (var k = 0 + j * layer.width; k < (j + 1) * layer.width; ++k) {
                        row.push(layer.data[k]);
                    }
                    mapData[layer.name].push(row);
                }
            }
            // DEBUG - script
            data.properties.startX = 18;
            data.properties.startY = 2;
            // Properties
            mapData.properties = data.properties;
            mapData.script = JSON.parse(data.properties.script);
            this.properties = data.properties;
        },
        // Gets the script code in the position x-y or false if ther is no script
        getScript: function(x, y) {
            if (mapData.script.hasOwnProperty(x + "x" + y)) {
                return mapData.script[x + "x" + y];
            } else {
                return false;
            }
        },
        // WTH?
        about: function() {
            return "About";
        }
    };
}();

var ZORPG = ZORPG || {};

// Monsters!
ZORPG.Monsters = function() {
    var monsters = [];
    return {
        init: function(totalMonsters) {
            var total = totalMonsters || 10;
            for (var i = 0; i < total; ++i) {
                var ent = new ZORPG.Ent("monster" + i, [ "pos", "actor", "monster" ]);
                ent.pos.x = ZORPG.Utils.die("1d15");
                ent.pos.y = ZORPG.Utils.die("1d15");
                ent.actor.name = "Monster " + i;
                ent.actor.roll();
                ent.actor.spd += 5;
                ent.monster.gold = 50;
                ent.monster.xp = 30;
                monsters.push(ent);
            }
        },
        // Iterate calls in the monster list
        // TODO: Check if monster is alive?
        each: function(call) {
            //console.log("ZORPG.Monster: Iterating call", call);
            for (var i = 0; i < monsters.length; ++i) {
                //console.log("ZORPG.Monster: Member", i, monsters[i]);
                call(monsters[i], i);
            }
        },
        // Remove a monster
        remove: function(ent) {
            var index = monsters.indexOf(ent);
            if (index >= 0) {
                monsters.splice(index, 1);
            }
        },
        // Get the fight-ready monsters(alive & in the same position as the party)
        getFightReady: function() {
            var list = [];
            for (var i = 0; i < monsters.length; ++i) {
                if (monsters[i].pos.equals(ZORPG.Player.pos) && monsters[i].actor.isAlive()) {
                    list.push(monsters[i]);
                }
            }
            console.log("MONSTERS:", list);
            return list;
        },
        willFight: function() {
            return this.getFightReady().length > 0;
        },
        // Roam the map, seeking and trying to kill the party
        // Returns true if there is a fight
        // TODO: refactor checking moster alive
        seekAndDestroy: function() {
            this.each(function(monster) {
                if (monster.actor.isAlive()) {
                    if (monster.pos.seek(ZORPG.Player.pos)) {
                        weHaveFight = true;
                    }
                }
            });
        }
    };
}();

// Scripting module
ZORPG.Script = function() {
    var lineNumber = 0;
    var script = null;
    var properties = null;
    var lastConfirm = null;
    return {
        // Inits a new script
        load: function(data) {
            lineNumber = 0;
            script = data.script;
            properties = data.properties;
        },
        // Last confirm
        lastConfirm: function() {
            return lastConfirm;
        },
        setConfirm: function(bol) {
            lastConfirm = bol;
        },
        clearConfirm: function() {
            lastConfirm = null;
        },
        // Runs a line
        run: function() {
            if (!this.isComplete()) {
                console.log("ZORPG.Script: Running line", lineNumber, script[lineNumber]);
                //try {
                var action = script[lineNumber].action;
                var args = script[lineNumber].args;
                lineNumber++;
                this[action](args);
            } else {
                console.log("ZORPG.Script: Script is completed.");
                ZORPG.State.set("play");
            }
        },
        // Check if script has ended
        isComplete: function() {
            return lineNumber >= script.length;
        },
        // SCRIPTING COMMANDS
        ifConfirm: function(args) {
            if (lastConfirm === null) {
                lineNumber--;
                // We will process this command twice
                ZORPG.State.set("message", {
                    mode: "showConfirm",
                    name: "",
                    msg: "COnfirm this"
                });
            } else {
                if (lastConfirm) {
                    console.log("yes");
                    lineNumber = args.onTrue;
                } else {
                    console.log("no");
                    lineNumber = args.onFalse;
                }
                lastConfirm = null;
                this.run();
            }
        },
        ifAward: function(args) {
            if (ZORPG.Player.party.hasAward(args.awardId)) {
                lineNumber = args.onTrue;
            } else {
                lineNumber = args.onFalse;
            }
            this.run();
        },
        ifQuest: function(args) {
            if (ZORPG.Player.party.hasQuest(args.questId)) {
                lineNumber = args.onTrue;
            } else {
                lineNumber = args.onFalse;
            }
            this.run();
        },
        exit: function(args) {
            lineNumber = script.length;
            this.run();
        },
        giveQuest: function(args) {
            console.log("QUEST GIVEN", args);
            ZORPG.Player.party.giveQuest(args);
            this.run();
        },
        giveAward: function(args) {
            console.log("AWARD GIVEN", args);
            ZORPG.Player.party.giveAward(args);
            this.run();
        },
        giveGold: function(args) {
            ZORPG.Player.party.gold += args;
            ZORPG.State.set("message", {
                mode: "show",
                msg: "Party found: " + args + " gold"
            });
        },
        removeQuest: function(args) {
            console.log("QUEST FINISHED", args);
            ZORPG.Player.party.removeQuest(args);
            this.run();
        },
        showDialog: function(args) {
            ZORPG.State.set("message", {
                mode: "showDialog",
                name: args.name,
                msg: args.msg
            });
        },
        show: function(args) {
            ZORPG.State.set("message", {
                mode: "show",
                msg: args
            });
        },
        // Seriously?
        taldo: function(args) {
            return "oaw";
        }
    };
}();

var ZORPG = ZORPG || {};

/**
 * State manager
 */
ZORPG.State = function() {
    var states = {};
    var currentState = null;
    return {
        // Adds a state. obj needs to have a structure?
        add: function(key, obj) {
            if (ZORPG.Utils.isObj(obj)) {
                obj._id = key;
                states[key] = obj;
            } else {
                throw Error("ZORPG.State: Adding invalid state object.");
            }
        },
        // Switches the active state
        set: function(key, scope) {
            if (typeof states[key] !== "undefined") {
                if (ZORPG.Utils.isObj(currentState) && typeof currentState.destroy === "function") {
                    console.log("%cZORPG.State." + currentState._id + " ended", "font-weight: bold");
                    currentState.destroy();
                }
                currentState = states[key];
                if (typeof currentState.init === "function") {
                    currentState.scope = scope;
                    // allows to pass objects and varibles to the State
                    console.log("%cZORPG.State." + key + " started", "font-weight: bold");
                    currentState.init();
                }
            } else {
                throw Error("ZORPG.State: That state object isn't registered.");
            }
        },
        // Return current state object
        get: function(key) {
            if (typeof key !== "undefined") {
                if (typeof states[key] !== "undefined") {
                    return states[key];
                } else {
                    throw Error("ZORPG.State: That state object isn't registered.");
                }
            } else {
                return currentState;
            }
        }
    };
}();

ZORPG.Tables = {
    /**
     * Classes table
Class       HP Attacks  Skill            Spells         Requirements
Knight      10       5  Arms Master      -              Mgt 15
Paladin      8       6  Crusader         Light          Mgt/Per/End 13
Archer       7       6  -                Detect Magic   Int/Acy 13
Cleric       5       7  -                All L1 Cleric  Per 13
Sorcerer     4       8  Cartography      All L1 Sorc.   Int 13
Robber       8       6  Thievery         -              Lck 13
Ninja        7       5  Thievery         -              Spd/Acy 13
Barbarian   12       4  -                -              End 15
Druid        6       7  Direction Sense  All L1 Druid   Int/Per 15
Ranger       9       6  Pathfinding      Awaken         Int/Per/End/Spd 12
     */
    cls: {
        knight: {
            hp: 10,
            at: 5,
            skill: "arms master"
        },
        sorcerer: {
            hp: 4,
            at: 8,
            skill: "cartography"
        }
    },
    /**
     * Races table
Name      HPLevel MPLevel Fire Elec Cold Pois Ener Magic   ThMod Skill
Human        +0     +0    7    7    7    7    7     7    +0 Swimming
Elf          -2    +2*    0    0    0    0    5     5   +10 -
Dwarf        +1     -1    5    5    5   20    5     0    +5 Spot Secret Doors
Gnome        -1     +1    2    2    2    2    2    20   +10 Danger Sense
Half-orc     +2     -2   10   10   10    0    0     0   -10 -
     */
    race: {
        human: {
            hp: 0,
            mp: 0,
            skill: "swimming"
        },
        "half-orc": {
            hp: 2,
            mp: -2,
            skill: ""
        }
    },
    /**
     * Stat modifier table
0-2           Nonexistant [sic]  -5
3-4           Very Poor          -4
5-6           Poor               -3
7-8           Very Low           -2
9-10          Low                -1
11-12         Average            +0
13-14         Good               +1
15-16         Very Good          +2
17-18         High               +3
19-20         Very High          +4
21-24         Great              +5
25-29         Super              +6
30-34         Amazing            +7
35-39         Incredible         +8
40-49         Gigantic           +9
50-74         Fantastic         +10
75-99         Astounding        +11
100-124       Astonishing       +12
125-149       Monumental        +13
150-174       Tremendous        +14
175-199       Collosal [sic]    +15
200-224       Awesome           +16
225-249       Awe Inspiring     +17
250+          Ultimate          +20
     */
    getStatBonus: function(stat) {
        if (stat >= 250) return {
            bonus: 20,
            name: "Ultimate"
        };
        if (stat >= 225) return {
            bonus: 17,
            name: "Awe Inspiring"
        };
        if (stat >= 200) return {
            bonus: 16,
            name: "Awesome"
        };
        if (stat >= 175) return {
            bonus: 15,
            name: "Collosal"
        };
        if (stat >= 150) return {
            bonus: 14,
            name: "Tremendous"
        };
        if (stat >= 125) return {
            bonus: 13,
            name: "Monumental"
        };
        if (stat >= 100) return {
            bonus: 12,
            name: "Astonishing"
        };
        if (stat >= 75) return {
            bonus: 11,
            name: "Astounding"
        };
        if (stat >= 50) return {
            bonus: 10,
            name: "Fantastic"
        };
        if (stat >= 40) return {
            bonus: 9,
            name: "Gigantic"
        };
        if (stat >= 35) return {
            bonus: 8,
            name: "Incredible"
        };
        if (stat >= 30) return {
            bonus: 7,
            name: "Amazing"
        };
        if (stat >= 25) return {
            bonus: 6,
            name: "Super"
        };
        if (stat >= 21) return {
            bonus: 5,
            name: "Great"
        };
        if (stat >= 19) return {
            bonus: 4,
            name: "Very High"
        };
        if (stat >= 17) return {
            bonus: 3,
            name: "High"
        };
        if (stat >= 15) return {
            bonus: 2,
            name: "Very Good"
        };
        if (stat >= 13) return {
            bonus: 1,
            name: "Good"
        };
        if (stat >= 11) return {
            bonus: 0,
            name: "Average"
        };
        if (stat >= 9) return {
            bonus: -1,
            name: "Low"
        };
        if (stat >= 7) return {
            bonus: -2,
            name: "Very Low"
        };
        if (stat >= 5) return {
            bonus: -3,
            name: "Poor"
        };
        if (stat >= 3) return {
            bonus: -4,
            name: "Very Poor"
        };
        if (stat >= 0) return {
            bonus: -5,
            name: "Nonexistant"
        };
    }
};

var ZORPG = ZORPG || {};

/**
 * Loaders, helpers and other utils & tools
 */
ZORPG.Utils = {
    // The basic variable of all leprosystems software artifacts
    taldo: "OAW",
    // Several type checks & utils
    isObj: function(thing) {
        return thing instanceof Object && thing.constructor === Object;
    },
    isEmptyObj: function(thing) {
        return this.isObj(thing) && Object.keys(thing).length === 0;
    },
    isArray: function(thing) {
        return Object.prototype.toString.call(thing) === "[object Array]";
    },
    inArray: function(obj, list) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i] === obj) return true;
        }
        return false;
    },
    // Remove from array
    remove: function(arr, elem) {
        var index = arr.indexOf(elem);
        if (index >= 0) {
            arr.splice(index, 1);
        }
    },
    // This implements RPG dice notation
    die: function(str) {
        try {
            //xdy+z => x dices of y faces, ie (random(y) * x) + z
            var plus = str.split("+");
            var die = plus[0];
            plus = 1 * plus[1] || 0;
            die = die.split("d");
            var factor = 1 * die[0];
            var faces = 1 * die[1];
            var result = factor * Math.round(Math.random() * (faces - 1)) + 1 + plus;
            console.log("Game.Utils.die: xdy+z:", factor, faces, plus, "=", result);
            return result;
        } catch (e) {
            console.error("Game.Utils.die: Bad die string", str);
            return false;
        }
    },
    log: function(str) {
        $("#console").prepend(">" + str + "\n");
    }
};

var ZORPG = ZORPG || {};

/**
 * ZORPG engine config
 */
ZORPG.__version__ = .01;

ZORPG.__name__ = "ZORPG demo";

// Play loop state
ZORPG.State.add("combat", {
    name: "Combating",
    combatQ: [],
    combatIndex: 0,
    combatTarget: 0,
    combatLoot: {
        xp: 0,
        gold: 0,
        gems: 0
    },
    init: function() {
        // Set key handlers
        var _this = this;
        ZORPG.Key.setPre(function(ev) {
            return !ZORPG.Canvas.isUpdating;
        });
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyA", function(ev) {
            ZORPG.Player.pos.rotL();
            _this.render();
        });
        ZORPG.Key.add("KeyD", function(ev) {
            ZORPG.Player.pos.rotR();
            _this.render();
        });
        ZORPG.Key.add("Space", function(ev) {
            _this.action("pass");
            _this.update();
        });
        ZORPG.Key.add("KeyF", function(ev) {
            _this.action("attack");
            _this.update();
        });
        // Init combat
        this.update();
    },
    getAliveChars: function() {
        var list = [];
        var chars = ZORPG.Player.party.actors;
        for (var i = 0; i < chars.length; ++i) {
            if (chars[i].actor.isAlive()) {
                list.push(chars[i]);
            }
        }
        return list;
    },
    beginTurn: function() {
        console.log("ZORPG.State.combat: Turn begins.");
        this.combatQ = [];
        this.combatIndex = 0;
        // Move monsters
        ZORPG.Monsters.seekAndDestroy();
        // Check if are fightable monsters & build combat queue
        if (ZORPG.Monsters.willFight()) {
            this.combatQ = ZORPG.Monsters.getFightReady().concat(this.getAliveChars()).sort(function(a, b) {
                if (a.actor.spd < b.actor.spd) {
                    return 1;
                }
                if (a.actor.spd > b.actor.spd) {
                    return -1;
                }
                return 0;
            });
            console.log("ZORPG.State.combat: Combat queue generated", this.combatQ);
        }
    },
    action: function(action) {
        var fighter = this.combatQ[this.combatIndex];
        console.log("ZORPG.State.combat: Action from", fighter);
        // fighter is a Monster...attack party
        if (fighter.hasCmp("monster")) {
            ZORPG.Player.party.damage(fighter);
        } else if (fighter.actor.isAlive()) {
            // fighter is a Party character...do action against targeted Monster
            var monster = this.getTargetedMonster();
            switch (action) {
              case "attack":
                monster.actor.damage(fighter);
                if (!monster.actor.isAlive()) {
                    // Killed monster -> removed
                    console.log("ZORPG.State.combat: Monster killed", monster);
                    ZORPG.Utils.remove(this.combatQ, monster);
                }
                break;

              default:
                console.log("ZORPG.State.combat: Character passed the turn.", fighter);
                break;
            }
        }
        this.combatIndex++;
    },
    // Gets the monster entity that is being targeted by player
    getTargetedMonster: function() {
        var j = 0;
        for (var i = 0; i < this.combatQ.length; ++i) {
            if (this.combatQ[i].hasCmp("monster")) {
                if (j === this.combatTarget) {
                    return this.combatQ[i];
                } else {
                    j++;
                }
            }
        }
    },
    // Main update
    update: function() {
        console.log("ZORPG.State.combat: Update begins.");
        // Checking if turn is begining
        if (this.combatQ.length === this.combatIndex) {
            this.beginTurn();
        }
        // Are there monsters left? If not...return to play state
        if (this.combatQ.length > this.getAliveChars().length) {
            // Perform actions until human
            while (this.combatQ.length > this.combatIndex && this.combatQ[this.combatIndex].hasCmp("monster")) {
                this.action();
            }
            // Is the party still alive?
            if (!ZORPG.Player.party.isAlive()) {
                alert("GAME OVER!");
                // TODO: please...
                ZORPG.State.set("main_menu");
            } else {
                // Ready for the first human
                this.render();
            }
        } else {
            ZORPG.State.set("play");
        }
    },
    // Update graphics
    render: function() {
        var _this = this;
        ZORPG.Canvas.setHUD("combat", {
            monsters: this.combatQ
        });
        ZORPG.Canvas.update(function() {
            ZORPG.Canvas.highlightChar(_this.combatQ[_this.combatIndex]);
            console.log("ZORPG.State.combat: Update completed");
        });
    },
    destroy: function() {
        this.combatQ = [];
        this.combatIndex = 0;
        this.combatTarget = 0;
        this.combatLoot = {
            xp: 0,
            gold: 0,
            gems: 0
        };
        ZORPG.Canvas.highlightChar();
        ZORPG.Key.removeAll();
    }
});

// Loading state...preloader and resource management
ZORPG.State.add("load", {
    name: "Loading...",
    init: function() {
        ZORPG.Canvas.init();
        ZORPG.Loader.addTextFileTask("map", "maps/map1.json");
        ZORPG.Loader.addImageTask("splash", "img/splash.png");
        ZORPG.Loader.addImageTask("npc", "img/npc.png");
        ZORPG.Loader.onTasksDoneObservable.add(function() {
            //ZORPG.State.set("main_menu");
            ZORPG.State.set("play");
        });
        ZORPG.Loader.load();
    },
    destroy: function() {}
});

// Main menu state.
ZORPG.State.add("main_menu", {
    name: "Main Menu",
    init: function() {
        // Build menu GUI
        // TODO: Refactor this in a class/module/obj?
        var splash = new BABYLON.GUI.Image("splash", "img/splash.png");
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click to Start");
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.Canvas.GUI.removeControl(splash);
            ZORPG.State.set("play");
        });
        ZORPG.Canvas.GUI.addControl(splash);
        ZORPG.Canvas.GUI.addControl(button1);
    },
    destroy: function() {}
});

// TODO: Refactor the dialog code into something that one can look at...
ZORPG.State.add("message", {
    name: "message",
    init: function() {
        this[this.scope.mode]();
    },
    show: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Ok");
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.msg;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;
        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.State.set("script");
        });
        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
    },
    showDialog: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Ok");
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.name + " says:\n" + this.scope.msg;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;
        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.State.set("script");
        });
        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
    },
    showConfirm: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Yes");
        var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "No");
        button1.width = "150px";
        button1.height = "40px";
        button1.left = "-100px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button2.width = "150px";
        button2.height = "40px";
        button2.left = "100px";
        button2.color = "white";
        button2.cornerRadius = 20;
        button2.background = "green";
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.name + " says:\n" + this.scope.msg;
        text1.color = "white";
        text1.top = -100;
        text1.fontSize = 24;
        button1.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.Canvas.GUI.removeControl(button2);
            ZORPG.Script.setConfirm(true);
            ZORPG.State.set("script");
        });
        button2.onPointerUpObservable.add(function() {
            ZORPG.Canvas.GUI.removeControl(text1);
            ZORPG.Canvas.GUI.removeControl(button1);
            ZORPG.Canvas.GUI.removeControl(button2);
            ZORPG.Script.setConfirm(false);
            ZORPG.State.set("script");
        });
        ZORPG.Canvas.GUI.addControl(text1);
        ZORPG.Canvas.GUI.addControl(button1);
        ZORPG.Canvas.GUI.addControl(button2);
    }
});

// Play loop state
ZORPG.State.add("play", {
    name: "Playing",
    turnPass: false,
    taldos: 0,
    //???
    init: function() {
        ZORPG.Canvas.setHUD("play");
        // Test code for player party - THIS IS HACKY, I know
        // TODO: Player should be stored somewhere else?(idea: build a singleton containing entities[actors])
        if (typeof ZORPG.Player === "undefined") {
            // TODO: Add check for create Player/Map/anything
            ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
            ZORPG.Monsters.init();
            // TODO: This should read data from map or something like that
            var names = [ "Lepro", "CragHack", "Maximus" ];
            ZORPG.Player = new ZORPG.Ent("player", [ "pos", "party" ]);
            ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
            ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
            for (var i = 0; i < 3; ++i) {
                var ent = new ZORPG.Ent("character" + i, [ "actor" ]);
                ent.actor.name = names[i];
                ent.actor.roll();
                ZORPG.Player.party.actors.push(ent);
            }
            ZORPG.Canvas.renderMap();
        }
        // Set key handlers
        var _this = this;
        ZORPG.Key.setPre(function(ev) {
            return !ZORPG.Canvas.isUpdating;
        });
        ZORPG.Key.setPost(function(ev) {
            if (ev.code !== "Escape" && ev.code.indexOf("Arrow") < 0) {
                _this.update();
            }
        });
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyW", function(ev) {
            ZORPG.Player.pos.moveFwd();
            _this.turnPass = true;
        });
        ZORPG.Key.add("KeyS", function(ev) {
            ZORPG.Player.pos.moveBck();
            _this.turnPass = true;
        });
        ZORPG.Key.add("KeyA", function(ev) {
            ZORPG.Player.pos.rotL();
        });
        ZORPG.Key.add("KeyD", function(ev) {
            ZORPG.Player.pos.rotR();
        });
        ZORPG.Key.add("Space", function(ev) {
            var data = ZORPG.Map.getScript(ZORPG.Player.pos.x, ZORPG.Player.pos.y);
            if (data) {
                ZORPG.State.set("script", {
                    script: data
                });
            } else {
                _this.turnPass = true;
            }
        });
        // First activation of play state, pass a turn
        this.turnPass = true;
        this.update();
    },
    update: function() {
        this.taldos++;
        console.log("ZORPG.State.play: Updating");
        if (this.turnPass) {
            console.log("ZORPG.State.play: Turn pass.");
            ZORPG.Utils.log("Time passes...");
            this.turnPass = false;
            // Monsters
            ZORPG.Monsters.seekAndDestroy();
        }
        // Render and go to combat if needed
        ZORPG.Canvas.update(function() {
            console.log("ZORPG.State.play: update completed");
            if (ZORPG.Monsters.willFight()) {
                ZORPG.Utils.log("Combat begins!");
                ZORPG.State.set("combat");
            } else {}
        });
    },
    destroy: function() {
        ZORPG.Key.removeAll();
    }
});

// Script run state
ZORPG.State.add("script", {
    name: "Scripting",
    init: function() {
        // Init vars
        var _this = this;
        // If loading a script...else, keep running the stored one
        if (typeof this.scope !== "undefined" && typeof this.scope.script !== "undefined") {
            console.log("ZORPG.State.script: New script loaded.");
            ZORPG.Script.load(this.scope.script);
        } else {
            console.log("ZORPG.State.script: Current script resumed.");
        }
        // Setup handlers
        /*ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.removeAll();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("Space", function(ev) {
            _this.next();
        }); */
        // Run first line
        this.next();
    },
    next: function() {
        if (!ZORPG.Script.isComplete()) {
            ZORPG.Script.run();
        } else {
            //ZORPG.Key.removeAll();
            ZORPG.State.set("play");
        }
    },
    destroy: function() {}
});

/**
 * actor: Component that provides actor attributes, like HPs, character stats, etc.
 */
ZORPG.Components.actor = {
    hp: 0,
    xp: 0,
    level: 1,
    name: "",
    str: 1,
    spd: 1,
    con: 1,
    ac: 0,
    // Roll attributes & get a random monster - DEBUG only?
    roll: function() {
        this.spd = ZORPG.Utils.die("1d10+4");
        this.str = ZORPG.Utils.die("1d10+4");
        this.con = ZORPG.Utils.die("1d10+4");
        this.ac = ZORPG.Utils.die("1d10+4");
        this.hp = ZORPG.Utils.die("1d30+10");
        this.xp = ZORPG.Utils.die("1d50+10");
    },
    toString: function() {
        return "<b>" + this.name + "</b>:" + this.hp + "hp " + this.spd + "spd " + this.str + "str " + this.ac + "ac";
    },
    isAlive: function() {
        return this.hp > 0;
    },
    // Damages this actor
    damage: function(ent) {
        // Calculate attack success/damage/etc.
        // attack roll - AC - Speed bonus
        // TODO: add resistances, spell buffs etc.
        var damage = ZORPG.Utils.die("1d" + ent.actor.str);
        console.log("ZORPG.Components.actor: Damage rolled = ", damage, "correction =", this.ac + ZORPG.Tables.getStatBonus(this.spd).bonus);
        damage -= this.ac + ZORPG.Tables.getStatBonus(this.spd).bonus;
        console.log("ZORPG.Components.actor: Damage corrected", damage);
        if (damage > 0) {
            this.hp -= damage;
            console.log("ZORPG.Components.actor: Actor " + this.name + " gets " + damage + " damage from " + ent.actor.name);
            ZORPG.Utils.log(this.name + " gets " + damage + " damage from " + ent.actor.name);
            // If the attack is from a monster, shake camera
            if (ent.hasCmp("monster")) {
                ZORPG.Canvas.shake(damage * .01);
            }
        } else {
            console.log("ZORPG.Components.actor: Actor " + this.name + " dodge attack from " + ent.actor.name);
            ZORPG.Utils.log(this.name + " dodge attack from " + ent.actor.name);
        }
    }
};

/**
 * monster: Component that provides monster attributes, like type, num of attacks, treasure spawned, etc.
 */
ZORPG.Components.monster = {
    attacks: 1,
    gold: 0,
    gems: 0,
    xp: 0,
    type: "undead"
};

/**
 * party: Attributes of a party. Quests, awards, list of actors, etc.
 */
ZORPG.Components.party = {
    gold: 1e3,
    gems: 50,
    food: 24,
    quests: {},
    awards: {},
    questItems: {},
    actors: [],
    hasQuest: function(key) {
        return this.quests.hasOwnProperty(key);
    },
    giveQuest: function(args) {
        if (!this.hasQuest(args.questId)) {
            this.quests[args.questId] = args.desc;
        }
    },
    removeQuest: function(key) {
        delete this.quests[key];
    },
    hasAward: function(key) {
        return this.awards.hasOwnProperty(key);
    },
    giveAward: function(args) {
        if (!this.hasAward(args.awardId)) {
            this.awards[args.awardId] = args.desc;
        }
    },
    // Damage & death
    isAlive: function() {
        for (var i = 0; i < this.actors.length; ++i) {
            if (this.actors[i].actor.isAlive()) {
                return true;
            }
        }
        return false;
    },
    // Damage a number of chars
    damage: function(ent) {
        for (var i = 0; i < ent.monster.attacks; ++i) {
            var index = Math.round(Math.random() * (this.actors.length - 1));
            console.log("ZORPG.Component.party: Actor picked to be attacked:", index, this.actors[index]);
            this.actors[index].actor.damage(ent);
        }
    }
};

/**
 * pos : Component that provides position, facing angle and methods
 *       to calculate movement coordinates, in order to perform checks on 
 *       a map object and movement.
 */
ZORPG.Components.pos = {
    x: 0,
    y: 0,
    ang: 0,
    rotR: function() {
        this.ang = this.ang + Math.PI / 2;
    },
    rotL: function() {
        this.ang = this.ang - Math.PI / 2;
    },
    getFwd: function() {
        var x = Math.round(this.x + Math.sin(this.ang));
        var y = Math.round(this.y + Math.cos(this.ang));
        return {
            x: x,
            y: y
        };
    },
    getBck: function() {
        var x = Math.round(this.x - Math.sin(this.ang));
        var y = Math.round(this.y - Math.cos(this.ang));
        return {
            x: x,
            y: y
        };
    },
    moveFwd: function() {
        var pos = this.getFwd();
        this.x = pos.x;
        this.y = pos.y;
    },
    moveBck: function() {
        var pos = this.getBck();
        this.x = pos.x;
        this.y = pos.y;
    },
    toString: function() {
        return this.x + "-" + this.y;
    },
    equals: function(pos) {
        return this.x === pos.x && this.y === pos.y;
    },
    seek: function(pos) {
        // Basic seek algorithm for monsters
        // TODO: add blocks for monsters(can swim? can enter certain tiles?)
        var angle = pos.ang % Math.PI / 2;
        var threshold = 3;
        console.log("ZORPG.Component.pos: Seeking from", this.x, this.y, " to ", pos.x, pos.y, "angle", angle);
        // If not near, forget it
        if (Math.abs(pos.x - this.x) <= threshold && Math.abs(pos.y - this.y) <= threshold) {
            console.log("ZORPG.Component.pos: position near, start chasing.");
            // Backup coords.
            var oldX = this.x;
            var oldY = this.y;
            // If angle is horizontal, try to match vertical coordinate first, and viceversa
            var first = "y", second = "x";
            if (angle === 0 || angle === -Math.PI / 2) {
                first = "x";
                second = "y";
            }
            // Try to match first coordinate, then the second one
            if (pos[first] > this[first]) {
                this[first]++;
            } else if (pos[first] < this[first]) {
                this[first]--;
            } else {
                if (pos[second] > this[second]) {
                    this[second]++;
                } else if (pos[second] < this[second]) {
                    this[second]--;
                }
            }
        }
    }
};