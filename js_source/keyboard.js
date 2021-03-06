var ZORPG = ZORPG || {};

/**
 *  Keyboard module
 */
ZORPG.Key = (function() {
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
                    return; // If pre-call returns false, the rest of the handler is not executed.
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

            if (ZORPG.$.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                console.log("ZORPG.Key: Listener registered. Adding the key too.", code)
            } else {
                console.log("ZORPG.Key: Already registered the listener, just adding the key.", code)
            }

            keys[code] = handler;
        },

        // Remove key handlers
        remove: function(code) {
            console.log("ZORPG.Key: Removing handler", code)
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];

                if (ZORPG.$.isEmptyObj(keys)) {
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
    }
})();

/**
Example

ZORPG.Key.addEvent("KeyA", function(ev) {
    console.log("Key A pressed", ev)
});
ZORPG.Key.addEvent("KeyS", function(ev) {
    console.log("Key S pressed")
});
ZORPG.Key.addEvent("KeyD", function(ev) {
    console.log("Key D pressed")
});
*/