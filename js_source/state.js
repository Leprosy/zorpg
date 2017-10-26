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
}



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