var ZORPG = ZORPG || {};

/**
 *  Map class
 *  
 *  name: unique name of the map
 */
ZORPG.Map = (function() {
    var mapData = {};

    return {
        // Clear old map data
        clear: function() {
            mapData = {
                floor: [],
                ceiling: [],
                object: [],
                walls: [],
                properties: {},
                script: {}
            };
        },

        // DEBUG only, delete this asap - Get the data dict
        getData: function() {
            return mapData;
        },

        // Loads a new map
        load: function(data) {
            console.log("ZORPG.Map: Loading and parsing", data)
            this.clear();

            // Parse tile data
            for (i = 0; i < data.layers.length; ++i) {
                var layer = data.layers[i];

                for (j = 0; j < layer.height; ++j) {
                    var row = [];

                    for (k = 0 + j * layer.width; k < (j + 1) * layer.width; ++k) {
                        row.push(layer.data[k]);
                    }

                    mapData[layer.name].push(row);
                }
            }

            // DEBUG - script
            data.properties.startX = 18;
            data.properties.startY = 2;

            // Properties
            mapData.properties = data.properties;
            mapData.script = JSON.parse(data.properties.script);
            this.properties = data.properties;
        },

        // Gets the script code in the position x-y or false if ther is no script
        getScript: function(x, y) {
            if (mapData.script.hasOwnProperty(x + "x" + y)) {
                return mapData.script[x + "x" + y];
            } else {
                return false;
            }
        },

        // WTH?
        about: function() {
            return "About";
        }
    }
})();
