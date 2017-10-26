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
