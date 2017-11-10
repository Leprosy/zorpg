var ZORPG = ZORPG || {};

/**
 *  Base ZORPG module...use it to build your own class/package/whatever
 *  
 */

// Demo class
ZORPG.NAMEOFYOURCLASS = function(args) {
    // Do something
};
ZORPG.NAMEOFYOURCLASS.prototype.METHOD = function(args) {
    // Do something
}

// Demo module
ZORPG.NAMEOFMODULE = (function() {
    var PRIVATESTUFF;

    return {
        PUBLICVAR: "content",
        PUBLICMETHOD: function(args) {
            // Do something
        }
    }
})();

