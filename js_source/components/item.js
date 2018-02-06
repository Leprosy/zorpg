/**
 * items
 */
ZORPG.Components.item = {
    material: "",
    //elemental: "",
    //attribute: "",
    name: "",
    equiped: false,

    getType: function() {
        return ZORPG.Tables.item[this.name].type;
    },
    getToHit: function() {
        return 0;
    },
    getDamage: function() {
        //return ZORPG.Tables.item[this.name].dmg + "+" + ZORPG.Tables.material[this.material].dmg;
    },
    getAC: function() {
        var itemAC = ZORPG.Tables.item[this.name].ac;
        return itemAC + itemAC > 0 ? ZORPG.Tables.material[this.material].ac : 0;
    },

    // TODO: Debug? could be useful to generate random loot
    generate: function(type) { // lvl => future use
        var ok = false;
        var item = { name: "", material: ""};

        // Generate item
        do {
            item.name = ZORPG.$.getRnd(ZORPG.Tables.item);
            item.material = ZORPG.$.getRnd(ZORPG.Tables.material);

            // Check type if provided
            if (typeof type !== "undefined") {
                console.log("Comparing arg/type", type, ZORPG.Tables.item[item.name].type)
                if (type === ZORPG.Tables.item[item.name].type) {
                    ok = true;
                }
            } else {
                ok = true;
            }
        } while (!ok);

        // Get item!
        ZORPG.$.extend(this, item);
    }
}