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
    this.id = new Date().getTime().toString(16);
    this.name = name;
    this.tags = [];
    this.data = {};
    this.manager = null;
};

// Adds a component to the entity
ZORPG.Ent.prototype.addCmp = function(key) {
    this[key] = {
        component: key,
        data: []
    };
    return this;
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

var ZORPG = ZORPG || {};

/**
 *  Map class
 *  
 *  name: unique name of the map
 */
ZORPG.Map = function(name, data) {
    this.name = name;
    this.data = [];
};

var ZORPG = ZORPG || {};

/**
 * State manager
 */
ZORPG.State = {
    _states: {},
    currentState: null,
    // Adds a state. obj needs to have a structure?
    add: function(key, obj) {
        if (ZORPG.Utils.isObj(obj)) {
            this._states[key] = obj;
        } else {
            throw Error("ZORPG.State: Adding invalid state object.");
        }
    },
    // Switches the active state
    set: function(key) {
        if (typeof this._states[key] !== "undefined") {
            if (ZORPG.Utils.isObj(this.currentState) && typeof this.currentState.destroy === "function") {
                this.currentState.destroy();
            }
            this.currentState = this._states[key];
            if (typeof this.currentState.init === "function") {
                this.currentState.init();
            }
        } else {
            throw Error("ZORPG.State: That state object isn't registered.");
        }
    }
};

var ZORPG = ZORPG || {};

/**
 * Loaders, helpers and other utils & tools
 */
ZORPG.Utils = {
    // The basic variable of all leprosystems software artifacts
    taldo: "OAW",
    // Checks if a var is an object
    isObj: function(thing) {
        return thing instanceof Object && thing.constructor === Object;
    }
};

var ZORPG = ZORPG || {};

/**
 * ZORPG engine config
 */
ZORPG.__version__ = .01;

ZORPG.__name__ = "ZORPG demo";