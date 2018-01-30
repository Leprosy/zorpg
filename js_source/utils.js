var ZORPG = ZORPG || {};

/**
 * Loaders, helpers and other utils & tools
 */
ZORPG.Utils = {
    // The basic variable of all leprosystems software artifacts
    taldo: "OAW",

    // Several type checks & utils
    isObj: function(thing) {
        return thing instanceof Object && thing.constructor === Object;
    },
    isEmptyObj: function(thing) {
        return this.isObj(thing) && Object.keys(thing).length === 0;
    },
    isArray: function(thing) {
        return (Object.prototype.toString.call(thing) === '[object Array]')
    },
    inArray: function(obj, list) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i] === obj) return true;
        }

        return false;
    },
    // Remove from array
    remove: function(arr, elem) {
        var index = arr.indexOf(elem);

        if (index >= 0) {
            arr.splice(index, 1);
        }
    },

    // This implements RPG dice notation
    die: function(str) {
        try {
            //xdy+z => x dices of y faces, ie (random(y) * x) + z
            var plus = str.split("+");
            var die = plus[0];
            plus = 1 * plus[1] || 0;

            die = die.split("d");
            var factor = 1 * die[0];
            var faces = 1 * die[1];
            console.log("Game.Utils.die: xdy+z:", factor, faces, plus);

            return factor * Math.round(Math.random() * (faces - 1)) + 1 + plus
        } catch(e) {
            console.error("Game.Utils.die: Bad die string", str);
            return false;
        }
    },

    log: function(str) {
        $("#console").prepend(">" + str + "\n");
    }
};