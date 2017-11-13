var ZORPG = ZORPG || {};

/**
 *  Keyboard module
 */
ZORPG.Key = (function() {
    var keys = {};
    var listener = function(event) {
        console.log("ZORPG.Key: Event fired.", event);
        if (keys.hasOwnProperty(event.code)) {
            console.log("ZORPG.Key: Registered key pressed", event);
            keys[event.code]();
        }
    };

    return {
        add: function(code, handler) {
            if (typeof handler !== "function") {
                throw Error("ZORPG.Key: Invalid listener function provided.");
            }

            if (ZORPG.Utils.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                console.log("ZORPG.Key: Listener registered.")
            } else {
                console.log("ZORPG.Key: Already registered the listener.")
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