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
    },

    isEmptyObj: function(thing) {
        return this.isObj(thing) && Object.keys(thing).length === 0;
    }
};