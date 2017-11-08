var ZORPG = ZORPG || {};

/**
 *  Keyboard module
 */
ZORPG.Key = {
    addEvent: function(code, handler) {
        document.addEventListener('keydown', function(event) {
            if (event.code == code && typeof handler === "function") {
                handler(event);
            }
        });
    }
}

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