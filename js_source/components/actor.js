/**
 * actor: Component that provides actor attributes, like HPs, character stats, etc.
 */
ZORPG.Components.actor = {
    hp: 0,
    xp: 0,
    level: 1,
    name: "",
    str: 1,
    spd: 1,
    con: 1,
    ac: 0,

    // Roll attributes & get a random monster - DEBUG only?
    roll: function() {
        this.spd = ZORPG.Utils.die("1d10+4");
        this.str = ZORPG.Utils.die("1d10+4");
        this.con = ZORPG.Utils.die("1d10+4");
        this.ac = ZORPG.Utils.die("1d10+4");

        this.hp = ZORPG.Utils.die("1d30+10");
        this.xp = ZORPG.Utils.die("1d50+10");
    },

    toString: function() {
        return this.name + ":" + this.hp + "hp";
    }
}

ZORPG.Components.monster = {
    attacks: 1,
    hits: 1,
    type: "undead"
}