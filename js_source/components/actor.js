/**
 * actor: Component that provides actor attributes, like HPs, character stats, etc.
 */
ZORPG.Components.actor = {
    hp: 0,
    xp: 0,
    name: "unknown_actor",

    str: 1,
    end: 1,
    dex: 1,
    int: 1,
    car: 1,
    per: 1,

    items: [],

    // Debug component
    toString: function() {
        return "<b>" + this.name + "</b>:" + this.hp + "/" + this.getMaxHP() +
               "hp " + this.dex + "dex " + this.str + "str";
    },

    // Gets max HP => str + end
    getMaxHP: function() {
        return this.str + this.end;
    },

    // Check an attribute
    checkThrow: function(name) {
        var die = ZORPG.$.die("1d10")
        console.log("ZORPG.Component.actor: Check throw '" + name + "' own/die:", this[name], die);
        return die <= this[name];
    },

    // Is actor alive
    isAlive: function() {
        return this.hp > 0;
    },

    // This actor gets attacked
    getAttacked: function(ent) {
        if (!this.checkThrow(ent.attackType)) {
            console.log("ZORPG.Component.actor: Actor receives attack", this.toString())
        } else {
            console.log("ZORPG.Component.actor: Actor dodges", this.toString())
        }
    },

    // Init actor
    init: function() {
        // Generate hit points
        this.hp = this.getMaxHP();
    }
}
