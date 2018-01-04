var ZORPG = ZORPG || {};

/**
 * State manager
 */
ZORPG.State = (function() {
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
                    currentState.destroy();
                }

                currentState = states[key];

                if (typeof currentState.init === "function") {
                    currentState.scope = scope; // allows to pass objects and varibles to the State
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
    }
})();



/**
 * Example code for state definition

ZORPG.State.add("first", {
    taldo: "OAW",
    init: function() {
        console.log("init first state");
    },
    destroy: function() {
        console.log("destroy first state");
    }
});

ZORPG.State.add("empty", {});

ZORPG.State.add("second", {
    foo: "bar",
    init: function() {
        console.log("init second state");
    },
    destroy: function() {
        console.log("destroy second state");
    }
});

ZORPG.State.set("first");
*/