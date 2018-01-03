var ZORPG = ZORPG || {};

/**
 *  Map class
 *  
 *  name: unique name of the map
 */
ZORPG.Map = (function() {
    var mapData = {};

    return {
        clear: function() {
            mapData = {
                floor: [],
                ceiling: [],
                object: [],
                walls: [],
                properties: {}
            };
        },

        getData: function() {
            return mapData;
        },

        load: function(data) {
            console.log("ZORPG.Map: Loading and parsing", data)
            // Clear
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

            // Properties
            mapData.properties = data.properties;
            this.properties = data.properties;
        },

        about: function() {
            return "About";
        }
    }
})();
