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
            this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), this.scene);
            this.camera.setTarget(BABYLON.Vector3.Zero());
            this.camera.attachControl(canvas, true);
            // Light
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = .7;
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
        renderMap: function(map) {
            console.log("ZORPG.Canvas: Rendering map", map);
            // Mats
            var materials = [];
            for (i = 0; i < 10; ++i) {
                var mat = new BABYLON.StandardMaterial("txt" + i, this.scene);
                mat.diffuseColor = new BABYLON.Color3(i / 10, i / 10, i / 10);
                materials.push(mat);
            }
            // Floors
            for (y = 0; y < map.floor.length; ++y) {
                for (x = 0; x < map.floor[y].length; ++x) {
                    var mesh = BABYLON.Mesh.CreateBox("floor" + x + "-" + y, this.tileSize, ZORPG.Canvas.scene);
                    mesh.position.x = x * this.tileSize;
                    mesh.position.z = y * this.tileSize;
                    mesh.position.y = 0;
                    mesh.scaling.y = .1;
                    mesh.material = materials[map.floor[y][x]];
                }
            }
            // Put camera/player
            this.camera.position.x = map.properties.startX * this.tileSize;
            this.camera.position.z = map.properties.startY * this.tileSize;
            this.camera.position.y = this.tileSize / 4;
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.rotation.y = 0;
        },
        // Updates camera to reflect player position
        updateCamera: function(player) {
            var _this = this;
            var turnSpent = player.ang === this.camera.rotation.y;
            this.isUpdating = true;
            // Useful while debugging: reset camera rotation & y-axis position
            this.camera.rotation.x = 0;
            this.camera.rotation.z = 0;
            this.camera.position.y = this.tileSize / 4;
            // Set animation and run
            var aniRot = new BABYLON.Animation("rotate", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniX = new BABYLON.Animation("move", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            var aniZ = new BABYLON.Animation("move", "position.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            aniX.setKeys([ {
                frame: 0,
                value: this.camera.position.x
            }, {
                frame: 15,
                value: player.x * this.tileSize
            } ]);
            aniZ.setKeys([ {
                frame: 0,
                value: this.camera.position.z
            }, {
                frame: 15,
                value: player.y * this.tileSize
            } ]);
            aniRot.setKeys([ {
                frame: 0,
                value: this.camera.rotation.y
            }, {
                frame: 15,
                value: player.ang
            } ]);
            this.camera.animations.push(aniX);
            this.camera.animations.push(aniZ);
            this.camera.animations.push(aniRot);
            this.scene.beginAnimation(this.camera, 0, 30, false, 1, function() {
                _this.isUpdating = false;
                //EVENTPLZ <- ????
                _this.camera.animations = [];
                // TODO: Check if a turn was spent
                if (turnSpent) {
                    console.log("ZORPG.Canvas: Turn spent");
                }
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
        for (i = 0; i < cmp.length; ++i) {
            this.addCmp(cmp[i]);
        }
    }
    // Chain API
    return this;
};

// Adds a component to the entity
ZORPG.Ent.prototype.addCmp = function(key) {
    if (ZORPG.Components.hasOwnProperty(key)) {
        this[key] = ZORPG.Components[key];
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
    for (i = 0; i < tagList.length; ++i) {
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
    for (i in cmpList) {
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
ZORPG.Components = {
    /**
     * pos : Component that provides position, facing angle and methods
     *       to calculate movement coordinates, in order to perform checks on 
     *       a map object and movement.
     */
    pos: {
        x: 0,
        y: 0,
        ang: 0,
        rotR: function() {
            this.ang = (this.ang + Math.PI / 2) % (Math.PI * 2);
        },
        rotL: function() {
            this.ang = (this.ang - Math.PI / 2) % (Math.PI * 2);
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
        }
    },
    /**
     * actor: Component that provides actor attributes, like HPs, character stats, etc.
     */
    actor: {
        hp: 0,
        name: "",
        speed: 0,
        toString: function() {
            return this.name + ":" + this.hp + "hp";
        }
    }
};

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
        if (keys.hasOwnProperty(event.code)) {
            console.log("ZORPG.Key: Registered key pressed", event);
            keys[event.code]();
        }
        // Post call
        if (typeof post === "function") {
            console.log("ZORPG.Key: Post-call method.");
            post(event);
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
                console.log("ZORPG.Key: Listener registered. Adding the key too.");
            } else {
                console.log("ZORPG.Key: Already registered the listener, just adding the key.");
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
            for (key in keys) {
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
            for (i = 0; i < data.layers.length; ++i) {
                var layer = data.layers[i];
                for (j = 0; j < layer.height; ++j) {
                    var row = [];
                    for (k = 0 + j * layer.width; k < (j + 1) * layer.width; ++k) {
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

// Scripting module
ZORPG.Script = function() {
    var lineNumber = 0;
    var script = null;
    var properties = null;
    return {
        // Inits a new script
        load: function(data) {
            lineNumber = 0;
            script = data.script;
            properties = data.properties;
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
                throw Error("ZORPG.Script: Script already completed.");
            }
        },
        // Check if script has ended
        isComplete: function() {
            return lineNumber >= script.length;
        },
        // SCRIPTING COMMANDS
        ifAward: function(args) {
            // if ZORPG.Player.hasAward(args.awardId) { lineNumber = args.onTrue} else
            lineNumber = args.onFalse;
            this.run();
        },
        ifQuest: function(args) {
            // if ZORPG.Player.hasQuest(args.awardId) { lineNumber = args.onTrue} else
            lineNumber = args.onFalse;
            this.run();
        },
        showDialog: function(args) {
            console.log("SHOWDIALOG", args);
        },
        show: function(args) {
            console.log("SHOW", args);
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

var ZORPG = ZORPG || {};

/**
 * Loaders, helpers and other utils & tools
 */
ZORPG.Utils = {
    // The basic variable of all leprosystems software artifacts
    taldo: "OAW",
    // Several type checks
    isObj: function(thing) {
        return thing instanceof Object && thing.constructor === Object;
    },
    isEmptyObj: function(thing) {
        return this.isObj(thing) && Object.keys(thing).length === 0;
    },
    isArray: function(thing) {
        return Object.prototype.toString.call(thing) === "[object Array]";
    }
};

var ZORPG = ZORPG || {};

/**
 * ZORPG engine config
 */
ZORPG.__version__ = .01;

ZORPG.__name__ = "ZORPG demo";

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

// Play loop state
ZORPG.State.add("play", {
    name: "Playing",
    init: function() {
        // ??? code. An Entity and a Map - THIS IS HACKY
        // TODO: Player should be stored somewhere else?(idea: build a singleton containing entities[actors])
        // TODO: Add check for create Player/Map/anytghin
        if (typeof ZORPG.Player === "undefined") {
            ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
            ZORPG.Player = new ZORPG.Ent("player", [ "pos", "actor" ]);
            ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
            ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
            ZORPG.Player.actor.name = "SirTaldo";
            ZORPG.Player.actor.hp = 30;
            ZORPG.Canvas.renderMap(ZORPG.Map.getData());
        }
        // Set key handlers
        ZORPG.Key.setPre(function(ev) {
            return !ZORPG.Canvas.isUpdating;
        });
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.removeAll();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("KeyW", function(ev) {
            console.log("up");
            ZORPG.Player.pos.moveFwd();
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyS", function(ev) {
            console.log("down");
            ZORPG.Player.pos.moveBck();
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyA", function(ev) {
            console.log("left");
            ZORPG.Player.pos.rotL();
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("KeyD", function(ev) {
            console.log("right");
            ZORPG.Player.pos.rotR();
            ZORPG.State.get().updatePlayer();
        });
        ZORPG.Key.add("Space", function(ev) {
            console.log("run script");
            var data = ZORPG.Map.getScript(ZORPG.Player.pos.x, ZORPG.Player.pos.y);
            if (data) {
                ZORPG.State.set("script", {
                    script: data
                });
            }
        });
    },
    updatePlayer: function() {
        ZORPG.Canvas.updateCamera(ZORPG.Player.pos);
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
        if (typeof this.scope.script !== "undefined") {
            ZORPG.Script.load(this.scope.script);
        }
        // Setup handlers
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.removeAll();
            ZORPG.State.set("main_menu");
        });
        ZORPG.Key.add("Space", function(ev) {
            _this.next();
        });
        // Run first line
        this.next();
    },
    next: function() {
        if (!ZORPG.Script.isComplete()) {
            ZORPG.Script.run();
        } else {
            ZORPG.Key.removeAll();
            ZORPG.State.set("play");
        }
    },
    destroy: function() {}
});

ZORPG.State.add("message", {
    name: "message",
    init: function() {
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "OK");
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.scope.title + ":" + this.scope.content;
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
    }
});