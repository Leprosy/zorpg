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
            console.log("OAW", player, this.camera);
            var _this = this;
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
        if (typeof pre === "function") {
            console.log("ZORPG.Key: Pre-call method.");
            var result = pre(event);
            if (!result) {
                console.log("ZORPG.Key: Handler aborted by the pre-call method.");
                return;
            }
        }
        if (keys.hasOwnProperty(event.code)) {
            console.log("ZORPG.Key: Registered key pressed", event);
            keys[event.code]();
        }
        if (typeof post === "function") {
            console.log("ZORPG.Key: Post-call method.");
            post(event);
        }
    };
    return {
        setPre: function(f) {
            if (typeof f !== "function") throw Error("ZORPG.Key: Invalid pre-call function provided.");
            pre = f;
        },
        setPost: function(f) {
            if (typeof f !== "function") throw Error("ZORPG.Key: Invalid post-call function provided.");
            post = f;
        },
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
        remove: function(code) {
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];
                if (ZORPG.Utils.isEmptyObj(keys)) {
                    document.removeEventListener("keydown", listener);
                }
            } else {
                throw Error("ZORPG.Key: Code doesn't have an event attached.", code);
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
        clear: function() {
            mapData = {
                floor: [],
                ceiling: [],
                object: [],
                walls: [],
                properties: {}
            };
        },
        getData: function() {
            return mapData;
        },
        load: function(data) {
            console.log("ZORPG.Map: Loading and parsing", data);
            // Clear
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
            // Properties
            mapData.properties = data.properties;
            this.properties = data.properties;
        },
        about: function() {
            return "About";
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
        set: function(key) {
            if (typeof states[key] !== "undefined") {
                if (ZORPG.Utils.isObj(currentState) && typeof currentState.destroy === "function") {
                    currentState.destroy();
                }
                currentState = states[key];
                if (typeof currentState.init === "function") {
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
    init: function() {
        console.log("ZORPG.State: Loading...");
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
    destroy: function() {
        console.log("ZORPG.State: Loading finished.");
    }
});

// Main menu state.
ZORPG.State.add("main_menu", {
    name: "Main Menu",
    init: function() {
        console.log("ZORPG.State: Main menu.");
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
        console.log("ZORPG.State: Playing.");
        // ??? code. An Entity and a Map
        ZORPG.Map.load(JSON.parse(ZORPG.Loader.tasks[0].text));
        ZORPG.Player = new ZORPG.Ent("player", [ "pos", "actor" ]);
        ZORPG.Player.pos.x = ZORPG.Map.properties.startX;
        ZORPG.Player.pos.y = ZORPG.Map.properties.startY;
        ZORPG.Player.actor.name = "SirTaldo";
        ZORPG.Player.actor.hp = 30;
        ZORPG.Canvas.renderMap(ZORPG.Map.getData());
        // Set key handlers
        ZORPG.Key.setPre(function(ev) {
            return !ZORPG.Canvas.isUpdating;
        });
        ZORPG.Key.add("Escape", function(ev) {
            ZORPG.Canvas.clear();
            ZORPG.Key.remove("Escape");
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
    },
    updatePlayer: function() {
        ZORPG.Canvas.updateCamera(ZORPG.Player.pos);
    },
    destroy: function() {}
});